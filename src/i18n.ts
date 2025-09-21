



import i18n from "i18next";
import { initReactI18next } from "react-i18next";

// Basic translation resources. Extend as needed.
const resources = {
  en: {
    translation: {
      brand: "SafeRove",
      tagline: "Your Travel Companion",
      nav: {
        login: "Login",
        register: "Create Account",
        adminLogin: "Admin Login",
        about: "About Us"
      },
      hero: {
        badge: "India’s First AI & Blockchain Tourist Safety Platform",
        title1: "Travel Anywhere.",
        title2: "Feel Safe, Always.",
        subtitle: "Your Trusted Companion for Adventure and Safety",
        description:
          "Discover a new era of travel with real-time threat detection, secure digital ID, personalized risk alerts, panic support, and multilingual access—all powered by the latest in AI and blockchain technology.",
        ctaPrimary: "Start Your Safe Journey",
        ctaSecondary: "How It Works",
        stats: {
          protectedTourists: "Protected Tourists",
          safeDestinations: "Safe Destinations",
          safetyScore: "Safety Score",
          languages: "Languages"
        }
      },
      login: {
        welcome: "Welcome Back to",
        signInToAccess: "Sign in to access your personalized safety dashboard.",
        email: "Email Address",
        emailPlaceholder: "you@example.com",
        password: "Password",
        passwordPlaceholder: "Enter your password",
        forgotPassword: "Forgot Password?",
        createAccount: "Create Account",
        signingIn: "Signing In...",
        signIn: "Sign in",
        toastSuccessTitle: "Login Successful! 🎉",
        toastSuccessDesc: "Welcome back to SafeRove.",
        toastFailTitle: "Login Failed",
        toastFailDesc: "Check your credentials and try again.",
        securePrivate: "Secure & Private",
        securityNote:
          "Powered by end-to-end encryption and blockchain security, your account and data stay safe with safeRove."
      }
    }
  },
  hi: {
    translation: {
      brand: "SafeRove",
      tagline: "आपका यात्रा साथी",
      nav: {
        login: "लॉगिन",
        register: "खाता बनाएं",
        adminLogin: "एडमिन लॉगिन",
        about: "हमारे बारे में"
      },
      hero: {
        badge: "भारत का पहला एआई और ब्लॉकचेन पर्यटन सुरक्षा प्लेटफ़ॉर्म",
        title1: "कहीं भी यात्रा करें।",
        title2: "हमेशा सुरक्षित महसूस करें।",
        subtitle: "रोमांच और सुरक्षा के लिए आपका विश्वसनीय साथी",
        description:
          "रीयल-टाइम खतरा पहचान, सुरक्षित डिजिटल आईडी, व्यक्तिगत जोखिम अलर्ट, पैनिक सपोर्ट और बहुभाषी एक्सेस के साथ यात्रा का नया युग—एआई और ब्लॉकचेन तकनीक द्वारा संचालित।",
        ctaPrimary: "अपनी सुरक्षित यात्रा शुरू करें",
        ctaSecondary: "यह कैसे काम करता है",
        stats: {
          protectedTourists: "सुरक्षित पर्यटक",
          safeDestinations: "सुरक्षित स्थान",
          safetyScore: "सुरक्षा स्कोर",
          languages: "भाषाएँ"
        }
      },
      login: {
        welcome: "वापसी पर स्वागत है",
        signInToAccess: "अपने व्यक्तिगत सुरक्षा डैशबोर्ड तक पहुँचने के लिए साइन इन करें।",
        email: "ईमेल पता",
        emailPlaceholder: "you@example.com",
        password: "पासवर्ड",
        passwordPlaceholder: "अपना पासवर्ड दर्ज करें",
        forgotPassword: "पासवर्ड भूल गए?",
        createAccount: "खाता बनाएं",
        signingIn: "साइन इन हो रहा है...",
        signIn: "साइन इन",
        toastSuccessTitle: "सफलतापूर्वक लॉगिन! 🎉",
        toastSuccessDesc: "SafeRove में आपका स्वागत है।",
        toastFailTitle: "लॉगिन विफल",
        toastFailDesc: "अपनी जानकारी जाँचें और फिर से प्रयास करें।",
        securePrivate: "सुरक्षित और निजी",
        securityNote:
          "एंड-टू-एंड एन्क्रिप्शन और ब्लॉकचेन सुरक्षा द्वारा संचालित, आपका खाता और डेटा SafeRove के साथ सुरक्षित रहता है।"
      }
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: "en",
    fallbackLng: "en",
    interpolation: { escapeValue: false }
  });

export default i18n;



