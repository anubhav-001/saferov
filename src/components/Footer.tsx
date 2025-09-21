const Footer = () => {
  return (
    <footer className="mt-24 border-t border-glass-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 grid grid-cols-1 md:grid-cols-3 gap-8 text-sm">
        <div>
          <h3 className="font-semibold mb-2">SafeRove</h3>
          <p className="text-muted-foreground">AI-powered tourist safety. Travel calmer, travel smarter.</p>
        </div>
        <div>
          <h4 className="font-semibold mb-2">Support</h4>
          <ul className="space-y-1 text-muted-foreground">
            <li>Help Center</li>
            <li>Contact</li>
            <li>Community</li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-2">Legal</h4>
          <ul className="space-y-1 text-muted-foreground">
            <li>Privacy</li>
            <li>Terms</li>
            <li>Cookies</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-glass-border py-4 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} SafeRove • All rights reserved
      </div>
    </footer>
  );
};

export default Footer;


