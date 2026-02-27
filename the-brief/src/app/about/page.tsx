export default function AboutPage() {
  return (
    <section className="py-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-6">About The Brief</h1>
        
        <div className="prose prose-lg text-gray-600">
          <p className="text-xl mb-6">
            The Brief was created with a simple mission: to make complex topics 
            accessible to everyone.
          </p>
          
          <p className="mb-6">
            In a world of information overload, understanding the context behind 
            the news can be overwhelming. We believe that everyone deserves clear, 
            concise explanations of the topics that shape our world — without the 
            jargon, without the bias, and without the noise.
          </p>
          
          <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-4">
            What We Cover
          </h2>
          
          <ul className="space-y-2 mb-8">
            <li><strong>Politics</strong> — How governments work and why decisions are made</li>
            <li><strong>Technology</strong> — The innovations changing our lives</li>
            <li><strong>Business</strong> — Economic forces and market dynamics</li>
            <li><strong>Science</strong> — Breakthroughs and discoveries explained</li>
            <li><strong>Health</strong> — Medical topics made understandable</li>
            <li><strong>Culture</strong> — Trends and movements shaping society</li>
          </ul>
          
          <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-4">
            Our Approach
          </h2>
          
          <p className="mb-6">
            Every explainer we publish follows three principles:
          </p>
          
          <ol className="space-y-4 mb-8">
            <li>
              <strong>Clarity first</strong> — We break down complex topics into 
              digestible pieces, using plain language and avoiding unnecessary jargon.
            </li>
            <li>
              <strong>Context matters</strong> — We don&apos;t just explain what 
              happened, we explain why it matters and how it fits into the bigger picture.
            </li>
            <li>
              <strong>Efficiency</strong> — We respect your time. Most explainers 
              take 3-5 minutes to read, giving you the essentials without the fluff.
            </li>
          </ol>
          
          <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-4">
            Get in Touch
          </h2>
          
          <p>
            Have a topic you&apos;d like us to explain? Want to collaborate? 
            We&apos;d love to hear from you. Reach out at{' '}
            <a 
              href="mailto:hello@thebrief.com" 
              className="text-indigo-600 hover:text-indigo-700"
            >
              hello@thebrief.com
            </a>
          </p>
        </div>
      </div>
    </section>
  )
}
