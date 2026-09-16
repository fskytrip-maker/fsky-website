import './App.css'

const features = [
  {
    title: 'Fast',
    description: 'Built for speed from the ground up, so nothing gets in your way.',
  },
  {
    title: 'Simple',
    description: 'A clean, focused experience without unnecessary complexity.',
  },
  {
    title: 'Reliable',
    description: 'Made to work the same way every time, so you can count on it.',
  },
]

function App() {
  return (
    <>
      <section id="hero">
        <p className="eyebrow">FSKY</p>
        <h1>A better way to get things done</h1>
        <p className="subtitle">
          FSKY helps you move faster with less friction. This is a starting
          point for the landing page — copy and design are easy to update.
        </p>
        <a className="cta" href="#contact">
          Get started
        </a>
      </section>

      <section id="features">
        {features.map((feature) => (
          <div className="feature" key={feature.title}>
            <h2>{feature.title}</h2>
            <p>{feature.description}</p>
          </div>
        ))}
      </section>

      <footer id="contact">
        <p>Interested in FSKY? Reach out to learn more.</p>
      </footer>
    </>
  )
}

export default App
