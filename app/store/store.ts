// --- START OF FILE app/store/store.ts ---

import { configureStore } from '@reduxjs/toolkit';
import authReducer from './features/auth/authSlice';
import locationReducer from './features/location/locationSlice';
import dashboardReducer from './features/admin/dashboardSlice';
import servicesReducer from './features/services/servicesSlice';
import bookingsReducer from './features/admin/bookingsSlice';
import reportsReducer from './features/admin/reportsSlice';
import customerDashboardReducer from './features/customer/dashboardSlice';
import customerBookingsReducer from './features/customer/bookingsSlice';
import customerAddressesReducer from './features/customer/addressSlice'; // <-- IMPORT NEW REDUCER
import customerSupportReducer from './features/customer/supportSlice';
import proDashboardReducer from './features/pro/proDashboardSlice';
import proBookingsReducer from './features/pro/proBookingsSlice';
import proAvailabilityReducer from './features/pro/proAvailabilitySlice';
import proEarningsReducer from './features/pro/proEarningsSlice';
import proReviewsReducer from './features/pro/proReviewsSlice';
import adminServicesReducer from './features/admin/adminServicesSlice';
import partnerApplicationReducer from './features/partnerApplicationSlice';
import adminPartnerApplicationsReducer from './features/admin/adminPartnerApplicationsSlice';
// import cartReducer from './features/cartSlice';
import serviceBrowserReducer from './features/serviceBrowserSlice';
import serviceDetailReducer from './features/serviceDetailSlice';
import cartReducer from "./features/cart/cartSlice"
import adminCustomersReducer from './features/admin/adminCustomersSlice';
import adminCustomerDetailsReducer from './features/admin/adminCustomerDetailsSlice';

import adminPartnersReducer from './features/admin/adminPartnersSlice';
import adminPartnerDetailsReducer from './features/admin/adminPartnerDetailsSlice';
import adminBlogReducer from './features/admin/adminBlogSlice';

export const makeStore = () => {
  return configureStore({
    reducer: {
      auth: authReducer,
      location: locationReducer,
      adminDashboard: dashboardReducer,
      servicesData: servicesReducer,
      adminBookings: bookingsReducer,
      adminReports: reportsReducer,
      customerDashboard: customerDashboardReducer,
      customerBookings: customerBookingsReducer,
      customerAddresses: customerAddressesReducer, // <-- ADD NEW REDUCER
      customerSupport: customerSupportReducer,
      proDashboard: proDashboardReducer,
      proBookings: proBookingsReducer,
      proAvailability: proAvailabilityReducer,
      proEarnings: proEarningsReducer,
      proReviews: proReviewsReducer,
      adminServices: adminServicesReducer,
      partnerApplication: partnerApplicationReducer,
      adminPartnerApplications: adminPartnerApplicationsReducer,
      cart: cartReducer,
      serviceBrowser: serviceBrowserReducer,
      serviceDetail: serviceDetailReducer,
      adminCustomers: adminCustomersReducer,
      adminCustomerDetails: adminCustomerDetailsReducer,
      adminPartners: adminPartnersReducer,
      adminPartnerDetails: adminPartnerDetailsReducer,
      adminBlog: adminBlogReducer,
    },
  });
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];

// --- END OF FILE app/store/store.ts ---