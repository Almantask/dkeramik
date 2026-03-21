export default function ContactPage() {
  return (
    <div className="min-h-screen bg-clay-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="font-playfair text-4xl md:text-5xl text-clay-700 mb-4">
            Get in Touch
          </h1>
          <p className="text-clay-600 leading-relaxed max-w-2xl mx-auto">
            Questions? Thoughts? Just want to say hello? I'd love to hear from you.
          </p>
        </div>

        {/* Introduction */}
        <div className="mb-12 text-center">
          <p className="text-clay-600 leading-relaxed mb-6">
            Whether you're curious about a specific piece, interested in custom work, or simply
            want to connect about the craft of ceramics, please reach out.
          </p>
          <p className="text-clay-600 leading-relaxed">
            I try to respond to all messages within 1-2 business days.
          </p>
        </div>

        {/* Contact Details */}
        <div className="bg-white border border-clay-200 rounded-sm p-8 mb-12">
          <div className="space-y-6">
            <div>
              <h3 className="text-clay-700 font-semibold text-sm uppercase tracking-wider mb-2">
                Email
              </h3>
              <a 
                href="mailto:hello@dkeramik.com"
                className="text-clay-600 hover:text-clay-500 transition-colors"
              >
                hello@dkeramik.com
              </a>
            </div>
            <div>
              <h3 className="text-clay-700 font-semibold text-sm uppercase tracking-wider mb-2">
                Studio Location
              </h3>
              <p className="text-clay-600">
                By appointment only<br />
                Please email to schedule a visit
              </p>
            </div>
          </div>
        </div>

        {/* Social Links */}
        <div className="bg-clay-100 border border-clay-200 rounded-sm p-8 mb-12">
          <h3 className="text-clay-700 font-semibold text-sm uppercase tracking-wider mb-4 text-center">
            Follow Along
          </h3>
          <div className="flex justify-center gap-6">
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-clay-600 hover:text-clay-500 transition-colors"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
              </svg>
              <span>Instagram</span>
            </a>
            <a
              href="https://pinterest.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-clay-600 hover:text-clay-500 transition-colors"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.627 0-12 5.372-12 12 0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738.098.119.112.224.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.631-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146 1.124.347 2.317.535 3.554.535 6.627 0 12-5.373 12-12 0-6.628-5.373-12-12-12z" />
              </svg>
              <span>Pinterest</span>
            </a>
          </div>
          <p className="text-clay-500 text-xs text-center mt-4">
            See behind-the-scenes of the making process, new releases, and daily inspiration
          </p>
        </div>

        {/* Closing */}
        <div className="text-center">
          <p className="font-playfair text-xl text-clay-600 italic leading-relaxed">
            Take it into your hands and feel the warmth of clay.
          </p>
        </div>
      </div>
    </div>
  );
}
