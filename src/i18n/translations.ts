// Language translations for Bengali and English

export type Language = 'bn' | 'en';

export interface Translations {
  // Common
  home: string;
  shop: string;
  about: string;
  contact: string;
  login: string;
  loginRegister: string;
  logout: string;
  register: string;
  search: string;
  cart: string;
  wishlist: string;
  orders: string;
  products: string;
  categories: string;
  save: string;
  cancel: string;
  delete: string;
  edit: string;
  add: string;
  update: string;
  loading: string;
  noData: string;
  myProfile: string;
  
  // Admin Panel
  dashboard: string;
  delivery: string;
  analytics: string;
  banners: string;
  homeSections: string;
  pages: string;
  settings: string;
  signOut: string;
  adminPanel: string;
  
  // Site Settings
  siteSettings: string;
  manageSettings: string;
  general: string;
  typography: string;
  colors: string;
  sections: string;
  header: string;
  footer: string;
  social: string;
  siteName: string;
  tagline: string;
  phone: string;
  email: string;
  address: string;
  saveChanges: string;
  
  // Products
  productName: string;
  price: string;
  salePrice: string;
  stock: string;
  status: string;
  active: string;
  inactive: string;
  addProduct: string;
  editProduct: string;
  
  // Orders
  orderNumber: string;
  customer: string;
  total: string;
  paymentStatus: string;
  orderStatus: string;
  pending: string;
  processing: string;
  shipped: string;
  delivered: string;
  cancelled: string;
  
  // Frontend
  addToCart: string;
  buyNow: string;
  outOfStock: string;
  inStock: string;
  viewDetails: string;
  allProducts: string;
  featuredProducts: string;
  newArrivals: string;
  discountProducts: string;
  
  // Footer
  company: string;
  ecommerce: string;
  customerService: string;
  termsConditions: string;
  privacyPolicy: string;
  returnPolicy: string;
  faq: string;
  campaigns: string;
  
  // Language
  language: string;
  bengali: string;
  english: string;
  selectLanguage: string;
  
  // Order Tracking
  trackYourOrder: string;
  trackOrderDescription: string;
  orderNumberPlaceholder: string;
  trackOrder: string;
  searching: string;
  enterOrderNumber: string;
  orderNotFound: string;
  checkOrderNumber: string;
  statusPending: string;
  statusProcessing: string;
  statusShipped: string;
  statusDelivered: string;
  statusCancelled: string;
  orderCancelled: string;
  orderCancelledDescription: string;
  orderDetails: string;
  orderDate: string;
  customerName: string;
  deliveryAddress: string;
  orderedItems: string;
  subtotal: string;
  deliveryCharge: string;
  
  // Admin Orders Page
  orderManagement: string;
  viewManageOrders: string;
  totalOrders: string;
  searchPlaceholder: string;
  allOrders: string;
  payment: string;
  courier: string;
  date: string;
  actions: string;
  bookCourier: string;
  booking: string;
  booked: string;
  courierTimeline: string;
  view: string;
  deleteOrder: string;
  deleteOrderConfirm: string;
  showingOrders: string;
  noOrdersFound: string;
  noOrdersYet: string;
  paid: string;
  inactiveOrders: string;
  courierSettings: string;
  addCourierNote: string;
  noCourierUpdates: string;
}

export const translations: Record<Language, Translations> = {
  bn: {
    // Common
    home: 'হোম',
    shop: 'শপ',
    about: 'আমাদের সম্পর্কে',
    contact: 'যোগাযোগ',
    login: 'লগইন',
    loginRegister: 'লগইন / রেজিস্টার',
    logout: 'লগআউট',
    register: 'রেজিস্ট্রেশন',
    search: 'খুঁজুন',
    cart: 'কার্ট',
    wishlist: 'উইশলিস্ট',
    orders: 'অর্ডার',
    products: 'প্রোডাক্ট',
    categories: 'ক্যাটাগরি',
    save: 'সেভ করুন',
    cancel: 'বাতিল',
    delete: 'মুছুন',
    edit: 'এডিট',
    add: 'যোগ করুন',
    update: 'আপডেট',
    loading: 'লোড হচ্ছে...',
    noData: 'কোন তথ্য নেই',
    myProfile: 'আমার প্রোফাইল',
    
    // Admin Panel
    dashboard: 'ড্যাশবোর্ড',
    delivery: 'ডেলিভারি',
    analytics: 'এনালাইটিক্স',
    banners: 'ব্যানার',
    homeSections: 'হোম সেকশন',
    pages: 'পেইজ',
    settings: 'সেটিংস',
    signOut: 'সাইন আউট',
    adminPanel: 'এডমিন প্যানেল',
    
    // Site Settings
    siteSettings: 'সাইট সেটিংস',
    manageSettings: 'এখান থেকে সব সেটিংস পরিচালনা করুন',
    general: 'সাধারণ',
    typography: 'টাইপোগ্রাফি',
    colors: 'রং',
    sections: 'সেকশন',
    header: 'হেডার',
    footer: 'ফুটার',
    social: 'সোশ্যাল',
    siteName: 'সাইটের নাম',
    tagline: 'ট্যাগলাইন',
    phone: 'ফোন',
    email: 'ইমেইল',
    address: 'ঠিকানা',
    saveChanges: 'পরিবর্তন সংরক্ষণ করুন',
    
    // Products
    productName: 'প্রোডাক্টের নাম',
    price: 'মূল্য',
    salePrice: 'বিক্রয় মূল্য',
    stock: 'স্টক',
    status: 'স্ট্যাটাস',
    active: 'সক্রিয়',
    inactive: 'নিষ্ক্রিয়',
    addProduct: 'প্রোডাক্ট যোগ করুন',
    editProduct: 'প্রোডাক্ট এডিট করুন',
    
    // Orders
    orderNumber: 'অর্ডার নম্বর',
    customer: 'গ্রাহক',
    total: 'মোট',
    paymentStatus: 'পেমেন্ট স্ট্যাটাস',
    orderStatus: 'অর্ডার স্ট্যাটাস',
    pending: 'অপেক্ষমান',
    processing: 'প্রসেসিং',
    shipped: 'শিপ করা হয়েছে',
    delivered: 'ডেলিভারি হয়েছে',
    cancelled: 'বাতিল',
    
    // Frontend
    addToCart: 'কার্টে যোগ করুন',
    buyNow: 'এখনই কিনুন',
    outOfStock: 'স্টক নেই',
    inStock: 'স্টকে আছে',
    viewDetails: 'বিস্তারিত দেখুন',
    allProducts: 'সব প্রোডাক্ট',
    featuredProducts: 'ফিচার্ড প্রোডাক্ট',
    newArrivals: 'নতুন পণ্য',
    discountProducts: 'ছাড়ের পণ্য',
    
    // Footer
    company: 'কোম্পানি',
    ecommerce: 'ই-কমার্স',
    customerService: 'কাস্টমার সার্ভিস',
    termsConditions: 'শর্তাবলী',
    privacyPolicy: 'গোপনীয়তা নীতি',
    returnPolicy: 'রিটার্ন পলিসি',
    faq: 'সাধারণ প্রশ্ন',
    campaigns: 'ক্যাম্পেইন',
    
    // Language
    language: 'ভাষা',
    bengali: 'বাংলা',
    english: 'English',
    selectLanguage: 'ভাষা নির্বাচন করুন',
    
    // Order Tracking
    trackYourOrder: 'আপনার অর্ডার ট্র্যাক করুন',
    trackOrderDescription: 'আপনার অর্ডার নম্বর দিয়ে অর্ডারের বর্তমান অবস্থা জানুন',
    orderNumberPlaceholder: 'অর্ডার নম্বর লিখুন (যেমন: SBD-20250122-1234)',
    trackOrder: 'ট্র্যাক করুন',
    searching: 'খোঁজা হচ্ছে...',
    enterOrderNumber: 'অনুগ্রহ করে অর্ডার নম্বর দিন',
    orderNotFound: 'অর্ডার পাওয়া যায়নি',
    checkOrderNumber: 'অনুগ্রহ করে অর্ডার নম্বর সঠিক আছে কিনা পরীক্ষা করুন',
    statusPending: 'অপেক্ষমান',
    statusProcessing: 'প্রসেসিং',
    statusShipped: 'শিপ করা হয়েছে',
    statusDelivered: 'ডেলিভারি হয়েছে',
    statusCancelled: 'বাতিল',
    orderCancelled: 'অর্ডার বাতিল করা হয়েছে',
    orderCancelledDescription: 'এই অর্ডারটি বাতিল করা হয়েছে',
    orderDetails: 'অর্ডারের বিবরণ',
    orderDate: 'অর্ডারের তারিখ',
    customerName: 'গ্রাহকের নাম',
    deliveryAddress: 'ডেলিভারি ঠিকানা',
    orderedItems: 'অর্ডারকৃত পণ্য',
    subtotal: 'সাবটোটাল',
    deliveryCharge: 'ডেলিভারি চার্জ',
    
    // Admin Orders Page
    orderManagement: 'অর্ডার ম্যানেজমেন্ট',
    viewManageOrders: 'সব গ্রাহকের অর্ডার দেখুন এবং পরিচালনা করুন',
    totalOrders: 'মোট অর্ডার',
    searchPlaceholder: 'অর্ডার #, নাম বা ফোনে খুঁজুন...',
    allOrders: 'সব অর্ডার',
    payment: 'পেমেন্ট',
    courier: 'কুরিয়ার',
    date: 'তারিখ',
    actions: 'অ্যাকশন',
    bookCourier: 'বুক কুরিয়ার',
    booking: 'বুক হচ্ছে...',
    booked: 'বুক হয়েছে',
    courierTimeline: 'কুরিয়ার টাইমলাইন',
    view: 'দেখুন',
    deleteOrder: 'অর্ডার মুছুন?',
    deleteOrderConfirm: 'এই অর্ডারটি স্থায়ীভাবে মুছে ফেলা হবে। এই কাজটি পূর্বাবস্থায় ফেরানো যাবে না।',
    showingOrders: 'দেখাচ্ছে',
    noOrdersFound: 'কোন অর্ডার পাওয়া যায়নি',
    noOrdersYet: 'এখনো কোন অর্ডার নেই',
    paid: 'পেইড',
    inactiveOrders: 'নিষ্ক্রিয় অর্ডার',
    courierSettings: 'কুরিয়ার সেটিংস',
    addCourierNote: 'কুরিয়ার নোট যোগ করুন',
    noCourierUpdates: 'এখনো কোন কুরিয়ার আপডেট নেই',
  },
  en: {
    // Common
    home: 'Home',
    shop: 'Shop',
    about: 'About Us',
    contact: 'Contact',
    login: 'Login',
    loginRegister: 'LOGIN / REGISTER',
    logout: 'Logout',
    register: 'Register',
    search: 'Search',
    cart: 'Cart',
    wishlist: 'Wishlist',
    orders: 'Orders',
    products: 'Products',
    categories: 'Categories',
    save: 'Save',
    cancel: 'Cancel',
    delete: 'Delete',
    edit: 'Edit',
    add: 'Add',
    update: 'Update',
    loading: 'Loading...',
    noData: 'No data available',
    myProfile: 'My Profile',
    
    // Admin Panel
    dashboard: 'Dashboard',
    delivery: 'Delivery',
    analytics: 'Analytics',
    banners: 'Banners',
    homeSections: 'Home Sections',
    pages: 'Pages',
    settings: 'Settings',
    signOut: 'Sign Out',
    adminPanel: 'Admin Panel',
    
    // Site Settings
    siteSettings: 'Site Settings',
    manageSettings: 'Manage all website settings from here',
    general: 'General',
    typography: 'Typography',
    colors: 'Colors',
    sections: 'Sections',
    header: 'Header',
    footer: 'Footer',
    social: 'Social',
    siteName: 'Site Name',
    tagline: 'Tagline',
    phone: 'Phone',
    email: 'Email',
    address: 'Address',
    saveChanges: 'Save Changes',
    
    // Products
    productName: 'Product Name',
    price: 'Price',
    salePrice: 'Sale Price',
    stock: 'Stock',
    status: 'Status',
    active: 'Active',
    inactive: 'Inactive',
    addProduct: 'Add Product',
    editProduct: 'Edit Product',
    
    // Orders
    orderNumber: 'Order Number',
    customer: 'Customer',
    total: 'Total',
    paymentStatus: 'Payment Status',
    orderStatus: 'Order Status',
    pending: 'Pending',
    processing: 'Processing',
    shipped: 'Shipped',
    delivered: 'Delivered',
    cancelled: 'Cancelled',
    
    // Frontend
    addToCart: 'Add to Cart',
    buyNow: 'Buy Now',
    outOfStock: 'Out of Stock',
    inStock: 'In Stock',
    viewDetails: 'View Details',
    allProducts: 'All Products',
    featuredProducts: 'Featured Products',
    newArrivals: 'New Arrivals',
    discountProducts: 'Discount Products',
    
    // Footer
    company: 'Company',
    ecommerce: 'E-Commerce',
    customerService: 'Customer Service',
    termsConditions: 'Terms & Conditions',
    privacyPolicy: 'Privacy Policy',
    returnPolicy: 'Return Policy',
    faq: 'FAQ',
    campaigns: 'Campaigns',
    
    // Language
    language: 'Language',
    bengali: 'বাংলা',
    english: 'English',
    selectLanguage: 'Select Language',
    
    // Order Tracking
    trackYourOrder: 'Track Your Order',
    trackOrderDescription: 'Enter your order number to check the current status of your order',
    orderNumberPlaceholder: 'Enter order number (e.g., SBD-20250122-1234)',
    trackOrder: 'Track Order',
    searching: 'Searching...',
    enterOrderNumber: 'Please enter an order number',
    orderNotFound: 'Order not found',
    checkOrderNumber: 'Please check if the order number is correct',
    statusPending: 'Pending',
    statusProcessing: 'Processing',
    statusShipped: 'Shipped',
    statusDelivered: 'Delivered',
    statusCancelled: 'Cancelled',
    orderCancelled: 'Order Cancelled',
    orderCancelledDescription: 'This order has been cancelled',
    orderDetails: 'Order Details',
    orderDate: 'Order Date',
    customerName: 'Customer Name',
    deliveryAddress: 'Delivery Address',
    orderedItems: 'Ordered Items',
    subtotal: 'Subtotal',
    deliveryCharge: 'Delivery Charge',
    
    // Admin Orders Page
    orderManagement: 'Order Management',
    viewManageOrders: 'View and manage all customer orders',
    totalOrders: 'Total Orders',
    searchPlaceholder: 'Search by order #, name or phone...',
    allOrders: 'All Orders',
    payment: 'Payment',
    courier: 'Courier',
    date: 'Date',
    actions: 'Actions',
    bookCourier: 'Book Courier',
    booking: 'Booking...',
    booked: 'Booked',
    courierTimeline: 'Courier Timeline',
    view: 'View',
    deleteOrder: 'Delete Order?',
    deleteOrderConfirm: 'This order will be permanently deleted. This action cannot be undone.',
    showingOrders: 'Showing',
    noOrdersFound: 'No orders found',
    noOrdersYet: 'No orders yet',
    paid: 'Paid',
    inactiveOrders: 'Inactive Orders',
    courierSettings: 'Courier Settings',
    addCourierNote: 'Add Courier Note',
    noCourierUpdates: 'No courier updates yet',
  }
};

export const getTranslation = (lang: Language, key: keyof Translations): string => {
  return translations[lang][key] || translations['en'][key] || key;
};
