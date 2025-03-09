
import { Github, Twitter, Linkedin } from "lucide-react";

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center">
          <div className="flex space-x-6">
            <a
              href="https://github.com/lhtvineettiwari"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-purple-600"
            >
              <Github className="h-6 w-6" />
            </a>
            {/* <a
              href="https://twitter.com/aivineet"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-purple-600"
            >
              <Twitter className="h-6 w-6" />
            </a> */}
            <a
              href="https://www.linkedin.com/in/vineet-tiwari-ab1456163/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-purple-600"
            >
              <Linkedin className="h-6 w-6" />
            </a>
            <a
              href="https://aivineet.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-purple-600"
            >
              <img src="/favicon.png" alt="AIVineet" className="h-6 w-6" />
            </a>
          </div>
          <p className="mt-8 text-center text-base text-gray-500">
            <a
              href="https://aivineet.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-500 hover:text-purple-600"
            >
              Powered by AIVineet
            </a>
          </p>
          <p className="mt-2 text-center text-sm text-gray-400">
            © {currentYear} ThatNewAI. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};
