import crypto                                    from "crypto";
import { FastifyPluginAsync }                    from "fastify";
import { Order }                                 from "../../models/Order";
import { Product }                               from "../../models/Product";
import { Coupon }                                from "../../models/Coupon";
import { Transaction }                           from "../../models/Transaction";
import { authenticate }                          from "../../hooks/authenticate";
import { parsePagination, paginationMeta }       from "../../utils/paginate";
import { generateOrderId, generateTransactionId } from "../../utils/id";
import { env }                                   from "../../config/env";
import { getOrCreateSettings }                   from "../../models/StoreSettings";

const COD_METHOD = "cod";

function resolveShippingFee(settings: any, deliveryOption?: string): number {
  if (!deliveryOption || deliveryOption === "standard") return settings.baseShippingCost;
  const opt = settings.deliveryOptions?.find((o: any) => o.key === deliveryOption && o.active);
  return (opt && opt.cost > 0) ? opt.cost : settings.baseShippingCost;
}

function verifyRazorpaySignature(
  razorpayOrderId: string,
  razorpayPaymentId: string,
  signature: string,
): boolean {
  const body     = `${razorpayOrderId}|${razorpayPaymentId}`;
  const expected = crypto
    .createHmac("sha256", env.razorpayKeySecret)
    .update(body)
    .digest("hex");
  return expected === signature;
}

export const orderRoutes: FastifyPluginAsync = async (app) => {

  // GET /orders — user's order history
  app.get("/", { preHandler: authenticate }, async (req, reply) => {
    const q = req.query as any;
    const { page, limit, skip } = parsePagination(q, 10);

    const filter: any = { userId: req.user.userId };
    if (q.status && q.status !== "all") filter.status = q.status;
    if (q.search) filter.orderId = { $regex: q.search, $options: "i" };

    const [orders, totalCount] = await Promise.all([
      Order.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      Order.countDocuments(filter),
    ]);

    reply.send({ orders, ...paginationMeta(page, limit, totalCount) });
  });

  // GET /orders/:id
  app.get("/:id", { preHandler: authenticate }, async (req, reply) => {
    const { id } = req.params as any;
    const order = await Order.findOne({ _id: id, userId: req.user.userId }).lean();
    if (!order) return reply.status(404).send({ message: "Order not found" });
    reply.send({ order });
  });

  // POST /orders/estimate — calculate totals without placing the order
  app.post("/estimate", {
    preHandler: authenticate,
    schema: {
      body: {
        type: "object",
        required: ["items"],
        properties: {
          items: {
            type: "array",
            items: {
              type: "object",
              required: ["productId", "quantity"],
              properties: {
                productId: { type: "string" },
                quantity:  { type: "number", minimum: 1 },
              },
            },
          },
          deliveryOption: { type: "string" },
          couponCode:     { type: "string" },
        },
      },
    },
  }, async (req, reply) => {
    const { items, deliveryOption, couponCode } = req.body as any;
    const settings = await getOrCreateSettings();

    const productIds = items.map((i: any) => i.productId);
    const products   = await Product.find({ _id: { $in: productIds } }).lean();
    const productMap = Object.fromEntries(products.map(p => [p._id.toString(), p]));

    const subtotal = items.reduce((s: number, i: any) => {
      const p = productMap[i.productId];
      return p ? s + (p.price * i.quantity) : s;
    }, 0);

    let discount = 0;
    let couponValid = false;
    if (couponCode) {
      const coupon = await Coupon.findOne({ code: couponCode.toUpperCase(), status: "active" });
      if (coupon && subtotal >= coupon.minOrder) {
        couponValid = true;
        if (coupon.discountType === "percent") discount = subtotal * (coupon.value / 100);
        if (coupon.discountType === "fixed")   discount = Math.min(coupon.value, subtotal);
      }
    }

    const taxRate      = settings.taxRate / 100;
    const tax          = (subtotal - discount) * taxRate;
    const shippingFee  = resolveShippingFee(settings, deliveryOption);
    const freeShipping = subtotal >= settings.freeShippingThreshold;
    const shipping     = freeShipping ? 0 : shippingFee;
    const total        = subtotal - discount + tax + shipping;

    reply.send({
      subtotal,
      discount,
      tax,
      shipping,
      total,
      taxRate:    settings.taxRate,
      freeShipping,
      couponValid: couponCode ? couponValid : undefined,
    });
  });

  // POST /orders — place an order
  // COD → status "Pending"; online → verify Razorpay signature first, then "Confirmed"
  app.post("/", {
    preHandler: authenticate,
    schema: {
      body: {
        type: "object",
        required: ["items", "shippingAddress", "paymentMethod"],
        properties: {
          items: {
            type: "array",
            minItems: 1,
            items: {
              type: "object",
              required: ["productId", "quantity"],
              properties: {
                productId: { type: "string" },
                quantity:  { type: "number", minimum: 1 },
              },
            },
          },
          shippingAddress:    { type: "object" },
          paymentMethod:      { type: "string" },
          deliveryOption:     { type: "string" },
          couponCode:         { type: "string" },
          razorpayOrderId:    { type: "string" },
          razorpayPaymentId:  { type: "string" },
          razorpaySignature:  { type: "string" },
        },
      },
    },
  }, async (req, reply) => {
    const {
      items,
      shippingAddress,
      paymentMethod,
      deliveryOption,
      couponCode,
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature,
    } = req.body as any;

    const settings = await getOrCreateSettings();

    const isCod = paymentMethod === COD_METHOD;

    // For non-COD: verify Razorpay signature before touching DB
    if (!isCod) {
      if (!razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
        return reply.status(400).send({ message: "Payment verification fields are required for online payments." });
      }
      if (!verifyRazorpaySignature(razorpayOrderId, razorpayPaymentId, razorpaySignature)) {
        return reply.status(400).send({ message: "Payment verification failed. Please contact support." });
      }
    }

    // Fetch live product prices — never trust client-supplied values
    const productIds = items.map((i: any) => i.productId);
    const products   = await Product.find({ _id: { $in: productIds } }).lean();
    const productMap = Object.fromEntries(products.map(p => [p._id.toString(), p]));

    const orderItems = items.map((item: any) => {
      const p = productMap[item.productId];
      if (!p) throw new Error(`Product ${item.productId} not found`);
      return { productId: p._id, name: p.name, image: p.image, price: p.price, quantity: item.quantity, sku: p.sku };
    });

    let subtotal = orderItems.reduce((s: number, i: any) => s + i.price * i.quantity, 0);

    let discount    = 0;
    let validCoupon: string | undefined;
    if (couponCode) {
      const coupon = await Coupon.findOne({ code: couponCode.toUpperCase(), status: "active" });
      if (coupon && subtotal >= coupon.minOrder) {
        // Calculate discountable amount based on coupon scope
        let discountableAmount = subtotal;
        if (coupon.scope === "product" && coupon.productIds?.length) {
          const ids = new Set(coupon.productIds.map(id => id.toString()));
          discountableAmount = orderItems
            .filter((i: any) => ids.has(i.productId.toString()))
            .reduce((s: number, i: any) => s + i.price * i.quantity, 0);
        } else if (coupon.scope === "category" && coupon.categoryIds?.length) {
          const catIds = new Set(coupon.categoryIds.map(id => id.toString()));
          // products already fetched — filter by categoryId field
          const matchingProductIds = new Set(
            products.filter((p: any) => p.categoryId && catIds.has(p.categoryId.toString()))
                    .map((p: any) => p._id.toString())
          );
          discountableAmount = orderItems
            .filter((i: any) => matchingProductIds.has(i.productId.toString()))
            .reduce((s: number, i: any) => s + i.price * i.quantity, 0);
        }

        if (discountableAmount > 0) {
          if (coupon.discountType === "percent") discount = discountableAmount * (coupon.value / 100);
          if (coupon.discountType === "fixed")   discount = Math.min(coupon.value, discountableAmount);
          validCoupon = coupon.code;
          await Coupon.findByIdAndUpdate(coupon._id, { $inc: { usageCount: 1, revenue: discountableAmount - discount } });
        }
      }
    }

    const taxRate     = settings.taxRate / 100;
    const tax         = (subtotal - discount) * taxRate;
    const shippingFee = resolveShippingFee(settings, deliveryOption);
    const shipping    = subtotal >= settings.freeShippingThreshold ? 0 : shippingFee;
    const total       = subtotal - discount + tax + shipping;

    const paymentDetails: Record<string, any> = { method: paymentMethod };
    if (isCod) {
      paymentDetails.codNote = `Collect ₹${Math.round(total)} on delivery`;
    } else {
      paymentDetails.razorpayOrderId   = razorpayOrderId;
      paymentDetails.razorpayPaymentId = razorpayPaymentId;
      paymentDetails.razorpaySignature = razorpaySignature;
      if (paymentMethod === "upi") {
        paymentDetails.upiVpa = undefined;
        paymentDetails.upiApp = undefined;
      } else if (paymentMethod === "netbanking") {
        paymentDetails.bankName = undefined;
        paymentDetails.bankCode = undefined;
      } else if (paymentMethod === "wallet") {
        paymentDetails.walletName = undefined;
      } else {
        paymentDetails.cardLast4   = undefined;
        paymentDetails.cardBrand   = undefined;
        paymentDetails.cardNetwork = undefined;
        paymentDetails.cardIssuer  = undefined;
        paymentDetails.cardType    = undefined;
      }
    }

    const order = await Order.create({
      orderId:           generateOrderId(),
      userId:            req.user.userId,
      items:             orderItems,
      subtotal,
      discount,
      tax,
      shipping,
      total,
      shippingAddress,
      paymentMethod,
      paymentDetails,
      couponCode:        validCoupon,
      razorpayOrderId:   isCod ? undefined : razorpayOrderId,
      razorpayPaymentId: isCod ? undefined : razorpayPaymentId,
      razorpaySignature: isCod ? undefined : razorpaySignature,
      status:            isCod ? "Pending" : "Confirmed",
    });

    // Record a transaction for every order regardless of payment method
    await Transaction.create({
      transactionId:     generateTransactionId(),
      orderId:           order._id,
      orderRef:          order.orderId,
      userId:            req.user.userId,
      amount:            total,
      currency:          "INR",
      status:            isCod ? "pending" : "success",
      method:            paymentMethod,
      razorpayOrderId:   isCod ? undefined : razorpayOrderId,
      razorpayPaymentId: isCod ? undefined : razorpayPaymentId,
      razorpaySignature: isCod ? undefined : razorpaySignature,
    });

    reply.status(201).send({ order });
  });
};
