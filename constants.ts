
import { SatelliteRecord, Translation } from './types';

// Major global cities for the watchlist
export const GLOBAL_CITIES = [
  "Dhaka", "London", "New York", "Tokyo", "Dubai", 
  "Sydney", "Mumbai", "Paris", "Cairo", "Singapore"
];

// Districts for Alert Subscription
export const DISTRICTS = [
  "Dhaka", "Chittagong", "Khulna", "Rajshahi", "Barisal", 
  "Sylhet", "Rangpur", "Mymensingh", "Comilla", "Narayanganj"
];

// Mock Satellite Data (Simulating content of satellite.json)
export const MOCK_SATELLITE_DATA: SatelliteRecord[] = Array.from({ length: 30 }).map((_, i) => ({
  date: new Date(Date.now() - i * 86400000).toISOString().split('T')[0],
  avgTemp: 32 + Math.random() * 5,
  humidity: 60 + Math.random() * 20,
  recordedAt: 'Sentinel-3'
}));

export const TEXT: Translation = {
  appTitle: { EN: "Global Heatwave & Climate Monitor", BN: "বিশ্বব্যাপী তাপপ্রবাহ ও জলবায়ু মনিটর" },
  dashboard: { EN: "Dashboard", BN: "ড্যাশবোর্ড" },
  research: { EN: "Research", BN: "গবেষণা" },
  alerts: { EN: "Alerts", BN: "সতর্কতা" },
  admin: { EN: "Admin", BN: "অ্যাডমিন" },
  currentWeather: { EN: "Current Weather", BN: "বর্তমান আবহাওয়া" },
  aiPrediction: { EN: "7-Day AI Prediction", BN: "৭ দিনের এআই পূর্বাভাস" },
  riskAnalysis: { EN: "Risk Analysis", BN: "ঝুঁকি বিশ্লেষণ" },
  districtHeat: { EN: "Global Watchlist", BN: "বিশ্বব্যাপী তালিকা" },
  builtBy: { EN: "Built by Ayan Saha", BN: "নির্মাণে: আয়ন সাহা" },
  submit: { EN: "Submit", BN: "জমা দিন" },
  name: { EN: "Name", BN: "নাম" },
  phone: { EN: "Phone", BN: "ফোন" },
  district: { EN: "Location", BN: "অবস্থান" },
  uploadData: { EN: "Upload Satellite Dataset", BN: "স্যাটেলাইট ডেটা আপলোড করুন" },
  retrainModel: { EN: "Re-train AI Model", BN: "এআই মডেল পুনরায় প্রশিক্ষণ দিন" },
  datasetSize: { EN: "Dataset Size", BN: "ডেটাসেট সাইজ" },
  modelAccuracy: { EN: "Model Accuracy", BN: "মডেলের সঠিকতা" },
  trainingStatus: { EN: "Training Status", BN: "প্রশিক্ষণের অবস্থা" },
  subscribeText: { EN: "Subscribe for Heatwave Alerts", BN: "তাপপ্রবাহের সতর্কতার জন্য সাবস্ক্রাইব করুন" },
  riskMeter: { EN: "Heat Risk Meter", BN: "তাপ ঝুঁকি মিটার" },
  searchPlaceholder: { EN: "Search any city...", BN: "যেকোনো শহর খুঁজুন..." },
  aiReportTitle: { EN: "AI Climate Situation Report", BN: "এআই জলবায়ু পরিস্থিতি রিপোর্ট" },
  nearbyTitle: { EN: "Nearby Relief & Resources", BN: "কাছাকাছি ত্রাণ ও সম্পদ" },
  generating: { EN: "Generating AI Report...", BN: "এআই রিপোর্ট তৈরি করা হচ্ছে..." },
  questionLabel: { EN: "Any specific questions? (Optional)", BN: "কোনো নির্দিষ্ট প্রশ্ন আছে? (ঐচ্ছিক)" },
  questionPlaceholder: { EN: "Ask about safety tips, shelter locations...", BN: "নিরাপত্তা টিপস বা আশ্রয়ের অবস্থান সম্পর্কে জিজ্ঞাসা করুন..." },
  adminAgent: { EN: "AI Agent & Request Center", BN: "এআই এজেন্ট এবং রিকোয়েস্ট সেন্টার" },
  pendingRequests: { EN: "Incoming Requests", BN: "আসা অনুরোধসমূহ" },
  generateReply: { EN: "Draft AI Email", BN: "এআই ইমেল খসড়া করুন" },
  sendEmail: { EN: "Send Email", BN: "ইমেল পাঠান" },
  noRequests: { EN: "No pending requests.", BN: "কোনো অনুরোধ নেই।" }
};
