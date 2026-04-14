import { useState } from 'react'
import Topbar from './components/Topbar'
import Header from './components/Header'
import Hero from './components/Hero'
import InsuranceForm from './components/InsuranceForm'
import Sidebar from './components/Sidebar'
import Footer from './components/Footer'

const initialForm = {
  license: '',
  mileage: '10000',
  postcode: '',
  houseNumber: '',
  addition: '',
  dob: '',
  email: '',
}

export default function App() {
  const [formData, setFormData] = useState(initialForm)

  function handleChange(e) {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  function handleSubmit(e) {
    e.preventDefault()
    // proceed to next step
  }

  return (
    <>
      <Topbar />
      <Header />
      <Hero activeStep={0} />
      <main className="main" role="main">
        <div className="container grid">
          <InsuranceForm formData={formData} onChange={handleChange} onSubmit={handleSubmit} />
          <Sidebar formData={formData} />
        </div>
      </main>
      <Footer />
    </>
  )
}
