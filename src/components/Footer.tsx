
import { Mail, Twitter, Facebook, Instagram, Linkedin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-background border-t mt-auto">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          {/* Logo and Trademark */}
          <div className="flex items-center space-x-3">
            <img 
              src="/logo.svg" 
              alt="NoNo Broker" 
              className="h-8 w-8"
            />
            <div className="text-sm text-muted-foreground">
              © 2025 NoNo Broker™. All rights reserved.
            </div>
          </div>

          {/* Support Email */}
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <Mail className="h-4 w-4" />
            <a 
              href="mailto:support@nonobroker.com" 
              className="hover:text-primary transition-colors"
            >
              support@nonobroker.com
            </a>
          </div>

          {/* Social Media Links */}
          <div className="flex items-center space-x-4">
            <a 
              href="https://twitter.com/nonobroker" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-primary transition-colors"
              aria-label="Follow us on Twitter"
            >
              <Twitter className="h-5 w-5" />
            </a>
            <a 
              href="https://facebook.com/nonobroker" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-primary transition-colors"
              aria-label="Follow us on Facebook"
            >
              <Facebook className="h-5 w-5" />
            </a>
            <a 
              href="https://instagram.com/nonobroker" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-primary transition-colors"
              aria-label="Follow us on Instagram"
            >
              <Instagram className="h-5 w-5" />
            </a>
            <a 
              href="https://linkedin.com/company/nonobroker" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-primary transition-colors"
              aria-label="Follow us on LinkedIn"
            >
              <Linkedin className="h-5 w-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;