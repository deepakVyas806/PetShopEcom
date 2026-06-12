import { FastifyPluginAsync } from "fastify";
import { authRoutes }          from "./auth";
import { productRoutes }       from "./products";
import { serviceRoutes }       from "./services";
import { orderRoutes }         from "./orders";
import { appointmentRoutes }   from "./appointments";
import { reviewRoutes }        from "./reviews";
import { notificationRoutes }  from "./notifications";
import { addressRoutes }       from "./addresses";
import { paymentMethodRoutes } from "./payment-methods";
import { couponRoutes }        from "./coupons";
import { adminDashboardRoutes }  from "./admin/dashboard";
import { adminCustomerRoutes }   from "./admin/customers";
import { adminOrderRoutes }      from "./admin/orders";
import { adminProductRoutes }    from "./admin/products";
import { adminServiceRoutes }    from "./admin/services";
import { adminAppointmentRoutes } from "./admin/appointments";
import { adminPromotionRoutes }  from "./admin/promotions";

export const registerRoutes: FastifyPluginAsync = async (app) => {
  // ── Public / customer routes ────────────────────────────────────────────────
  await app.register(authRoutes,          { prefix: "/auth"            });
  await app.register(productRoutes,       { prefix: "/products"        });
  await app.register(serviceRoutes,       { prefix: "/services"        });
  await app.register(orderRoutes,         { prefix: "/orders"          });
  await app.register(appointmentRoutes,   { prefix: "/appointments"    });
  await app.register(reviewRoutes,        { prefix: ""                 }); // uses /products/:id/reviews
  await app.register(notificationRoutes,  { prefix: "/notifications"   });
  await app.register(addressRoutes,       { prefix: "/addresses"       });
  await app.register(paymentMethodRoutes, { prefix: "/payment-methods" });
  await app.register(couponRoutes,        { prefix: "/coupons"         });

  // ── Admin routes ────────────────────────────────────────────────────────────
  await app.register(adminDashboardRoutes,  { prefix: "/admin/dashboard"    });
  await app.register(adminCustomerRoutes,   { prefix: "/admin/customers"    });
  await app.register(adminOrderRoutes,      { prefix: "/admin/orders"       });
  await app.register(adminProductRoutes,    { prefix: "/admin/products"     });
  await app.register(adminServiceRoutes,    { prefix: "/admin/services"     });
  await app.register(adminAppointmentRoutes,{ prefix: "/admin/appointments" });
  await app.register(adminPromotionRoutes,  { prefix: "/admin/promotions"   });
};
