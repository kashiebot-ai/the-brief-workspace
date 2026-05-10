import type { Metadata } from 'next'
import QuizClient from './QuizClient'

export const metadata: Metadata = {
  title: 'VoteFinder - Which Party Matches Your Values?',
  description: 'Take our 25-question quiz to find which New Zealand political party aligns with your values for the 2026 election. Compare Labour, National, Greens, ACT, NZ First, and Te Pati Māori.',
  openGraph: {
    title: 'VoteFinder - Which Party Matches Your Values?',
    description: 'Take our 25-question quiz to find which NZ party aligns with your values for 2026.',
  },
}

// FAQ data for the quiz page
const quizFAQ = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'What is VoteFinder?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'VoteFinder is a 25-question quiz that matches your political values with New Zealand political parties. It covers key issues like housing, climate change, taxes, and co-governance to help you understand which party aligns with your views for the 2026 election.',
      },
    },
    {
      '@type': 'Question',
      name: 'Which political parties are included?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'VoteFinder includes all major New Zealand political parties: Labour, National, Greens, ACT, NZ First, and Te Pati Māori. Each party\'s positions are based on their official policies, voting records, and public statements.',
      },
    },
    {
      '@type': 'Question',
      name: 'How accurate are the results?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'VoteFinder provides an indication of which parties align with your stated values based on 25 key policy questions. While it\'s a useful guide, we recommend researching each party\'s full policy platform before making your final voting decision.',
      },
    },
    {
      '@type': 'Question',
      name: 'What issues does the quiz cover?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'The quiz covers 25 key policy areas including: housing affordability, climate action, tax policy, co-governance and Māori rights, immigration, healthcare privatisation, benefits and welfare, law and order, education, foreign investment, Treaty of Waitangi principles, defence spending, Three Waters, smoking regulations, and superannuation age.',
      },
    },
    {
      '@type': 'Question',
      name: 'Is this quiz biased?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'VoteFinder is designed to be non-partisan. Party positions are based on official policy documents, voting records in Parliament, and public statements. The questions are framed neutrally to present both sides of each issue.',
      },
    },
    {
      '@type': 'Question',
      name: 'Can I share my results?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes! After completing the quiz, you can copy your results to share on social media or with friends. We encourage sharing to spark conversations about political values and engagement.',
      },
    },
  ],
}

export default function QuizPage() {
  return (
    <>
      {/* FAQPage Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(quizFAQ),
        }}
      />
      <QuizClient />
    </>
  )
}
