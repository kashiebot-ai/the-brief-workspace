import Link from 'next/link'

interface ExplainerCardProps {
  title: string
  summary: string
  category: string
  slug: string
  readingTime: number
}

export default function ExplainerCard({
  title,
  summary,
  category,
  slug,
  readingTime,
}: ExplainerCardProps) {
  return (
    <Link href={`/explainer/${slug}`} className="group block">
      <article className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 p-6 border border-gray-100">
        <div className="flex items-center gap-2 mb-3">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800 capitalize">
            {category}
          </span>
          <span className="text-xs text-gray-500">{readingTime} min read</span>
        </div>
        <h2 className="text-xl font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors mb-2">
          {title}
        </h2>
        <p className="text-gray-600 line-clamp-2">{summary}</p>
      </article>
    </Link>
  )
}
