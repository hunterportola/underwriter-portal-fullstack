import { useState, useRef } from 'react'
import { Button } from './components/Button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './components/Card'
import { InputSmall } from './components/InputSmall'
import { InputMedium } from './components/InputMedium'
import { InputLarge } from './components/InputLarge'
import { Dropdown } from './components/Dropdown'
import { SearchDropdown } from './components/SearchDropdown'
import { DateInput } from './components/DateInput'
import { YearInput } from './components/YearInput'
import { DollarAmountInput } from './components/DollarAmountInput'
import { CurrencyInput } from './components/CurrencyInput'

function App() {
  const [count, setCount] = useState(0)
  const [inputValue, setInputValue] = useState('')
  const [emailValue, setEmailValue] = useState('')
  const [phoneValue, setPhoneValue] = useState('')
  const [requiredValue, setRequiredValue] = useState('')
  const [dropdownValue, setDropdownValue] = useState('')
  const [searchDropdownValue, setSearchDropdownValue] = useState('')
  const [dateValue, setDateValue] = useState('')
  const [yearValue, setYearValue] = useState('')
  const [salaryValue, setSalaryValue] = useState('')
  const [budgetValue, setBudgetValue] = useState('')
  const [genericAmountValue, setGenericAmountValue] = useState('')
  const [showErrors, setShowErrors] = useState(false)
  const dateInputRef = useRef<HTMLInputElement>(null)
  const yearInputRef = useRef<HTMLInputElement>(null)

  // Large list of cities for search dropdown demo
  const cityOptions = [
    { value: 'new-york', label: 'New York' },
    { value: 'los-angeles', label: 'Los Angeles' },
    { value: 'chicago', label: 'Chicago' },
    { value: 'houston', label: 'Houston' },
    { value: 'phoenix', label: 'Phoenix' },
    { value: 'philadelphia', label: 'Philadelphia' },
    { value: 'san-antonio', label: 'San Antonio' },
    { value: 'san-diego', label: 'San Diego' },
    { value: 'dallas', label: 'Dallas' },
    { value: 'san-jose', label: 'San Jose' },
    { value: 'austin', label: 'Austin' },
    { value: 'jacksonville', label: 'Jacksonville' },
    { value: 'fort-worth', label: 'Fort Worth' },
    { value: 'columbus', label: 'Columbus' },
    { value: 'charlotte', label: 'Charlotte' },
    { value: 'francisco', label: 'San Francisco' },
    { value: 'indianapolis', label: 'Indianapolis' },
    { value: 'seattle', label: 'Seattle' },
    { value: 'denver', label: 'Denver' },
    { value: 'washington', label: 'Washington D.C.' },
    { value: 'boston', label: 'Boston' },
    { value: 'el-paso', label: 'El Paso' },
    { value: 'detroit', label: 'Detroit' },
    { value: 'nashville', label: 'Nashville' },
    { value: 'portland', label: 'Portland' },
    { value: 'memphis', label: 'Memphis' },
    { value: 'oklahoma-city', label: 'Oklahoma City' },
    { value: 'las-vegas', label: 'Las Vegas' },
    { value: 'louisville', label: 'Louisville' },
    { value: 'baltimore', label: 'Baltimore' },
    { value: 'milwaukee', label: 'Milwaukee' },
    { value: 'albuquerque', label: 'Albuquerque' },
    { value: 'tucson', label: 'Tucson' },
    { value: 'fresno', label: 'Fresno' },
    { value: 'mesa', label: 'Mesa' },
    { value: 'sacramento', label: 'Sacramento' },
    { value: 'atlanta', label: 'Atlanta' },
    { value: 'kansas-city', label: 'Kansas City' },
    { value: 'colorado-springs', label: 'Colorado Springs' },
    { value: 'miami', label: 'Miami' },
    { value: 'raleigh', label: 'Raleigh' },
    { value: 'omaha', label: 'Omaha' },
    { value: 'long-beach', label: 'Long Beach' },
    { value: 'virginia-beach', label: 'Virginia Beach' },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-cotton to-sand p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header Section */}
        <div className="text-center space-y-4">
          <h1 className="text-5xl font-serif font-bold text-portola-green mb-2">
            Portola Components
          </h1>
          <p className="text-lg font-script text-forest-moss italic">
            A sophisticated, nature-inspired design system
          </p>
          <p className="text-steel font-sans max-w-2xl mx-auto leading-relaxed">
            Elegant, timeless components crafted with natural colors and sophisticated typography 
            for all your digital products.
          </p>
        </div>

        {/* Color Palette Showcase */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="font-script text-2xl">Color Palette</CardTitle>
            <CardDescription>Our nature-inspired color system</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <div className="h-16 bg-portola-green rounded-lg shadow-soft border border-pebble"></div>
                <p className="text-xs font-serif text-portola-green">Portola Green</p>
                <p className="text-xs font-mono text-steel">#1E361E</p>
              </div>
              <div className="space-y-2">
                <div className="h-16 bg-railway-gold rounded-lg shadow-soft border border-pebble"></div>
                <p className="text-xs font-serif text-portola-green">Railway Gold</p>
                <p className="text-xs font-mono text-steel">#CEAD64</p>
              </div>
              <div className="space-y-2">
                <div className="h-16 bg-forest-moss rounded-lg shadow-soft border border-pebble"></div>
                <p className="text-xs font-serif text-portola-green">Forest Moss</p>
                <p className="text-xs font-mono text-steel">#2F4F2F</p>
              </div>
              <div className="space-y-2">
                <div className="h-16 bg-dried-thyme rounded-lg shadow-soft border border-pebble"></div>
                <p className="text-xs font-serif text-portola-green">Dried Thyme</p>
                <p className="text-xs font-mono text-steel">#C2C1B0</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Components Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Button Components */}
          <Card>
            <CardHeader>
              <CardTitle>Button Variants</CardTitle>
              <CardDescription>
                Sophisticated button styles with natural aesthetics
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <Button onClick={() => setCount(count + 1)} className="w-full">
                  Primary
                </Button>
                <Button variant="secondary" className="w-full">Secondary</Button>
                <Button variant="accent" className="w-full">Accent</Button>
                <Button variant="dried-thyme" className="w-full">Dried Thyme</Button>
                <Button variant="pebble" className="w-full">Pebble</Button>
                <Button variant="sand" className="w-full">Sand</Button>
                <Button variant="outline" className="w-full">Outline</Button>
                <Button variant="ghost" className="w-full">Ghost</Button>
              </div>
              <div className="flex gap-2 justify-between">
                <Button size="sm">Small</Button>
                <Button size="md">Medium</Button>
                <Button size="lg">Large</Button>
              </div>
            </CardContent>
          </Card>

          {/* Input Components */}
          <Card>
            <CardHeader>
              <CardTitle>Input Fields</CardTitle>
              <CardDescription>
                Floating label inputs with sophisticated interactions
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <InputMedium
                label="Full Name"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                error="Full name is required"
                showError={showErrors && !inputValue.trim()}
              />
              <InputMedium
                label="Email Address"
                type="email"
                value={emailValue}
                onChange={(e) => setEmailValue(e.target.value)}
                error="Valid email is required"
                showError={showErrors && (!emailValue.includes('@') || !emailValue.trim())}
              />
              <InputMedium
                label="Phone Number"
                type="tel"
                value={phoneValue}
                onChange={(e) => setPhoneValue(e.target.value)}
                error="Phone number is required"
                showError={showErrors && !phoneValue.trim()}
              />
              <InputMedium
                label="Required Field"
                value={requiredValue}
                onChange={(e) => setRequiredValue(e.target.value)}
                error="This field is required"
                showError={showErrors && !requiredValue.trim()}
              />
              <div className="grid grid-cols-3 gap-2">
                <InputSmall label="Small Field" />
                <InputMedium label="Medium Field" />
                <InputLarge label="Large Field" />
              </div>
              <Dropdown
                label="Country"
                options={[
                  { value: 'us', label: 'United States' },
                  { value: 'ca', label: 'Canada' },
                  { value: 'uk', label: 'United Kingdom' },
                  { value: 'au', label: 'Australia' },
                  { value: 'de', label: 'Germany' },
                  { value: 'fr', label: 'France' },
                  { value: 'jp', label: 'Japan' },
                ]}
                value={dropdownValue}
                onChange={setDropdownValue}
                error="Country selection is required"
                showError={showErrors && !dropdownValue}
              />
              <SearchDropdown
                label="City"
                options={cityOptions}
                value={searchDropdownValue}
                onChange={setSearchDropdownValue}
                error="City selection is required"
                showError={showErrors && !searchDropdownValue}
              />
              <div className="grid grid-cols-2 gap-4">
                <DateInput
                  ref={dateInputRef}
                  label="Birth Date"
                  value={dateValue}
                  onChange={setDateValue}
                  onValidDate={() => yearInputRef.current?.focus()}
                  error="Valid birth date is required"
                  showError={showErrors && !dateValue}
                />
                <YearInput
                  ref={yearInputRef}
                  label="Graduation Year"
                  value={yearValue}
                  onChange={setYearValue}
                  error="Valid graduation year is required"
                  showError={showErrors && !yearValue}
                  minYear={1950}
                  maxYear={2030}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <DollarAmountInput
                  label="Annual Salary"
                  value={salaryValue}
                  onChange={setSalaryValue}
                  error="Salary amount is required"
                  showError={showErrors && !salaryValue}
                  allowCents={false}
                  maxAmount={10000000}
                />
                <DollarAmountInput
                  label="Monthly Budget"
                  value={budgetValue}
                  onChange={setBudgetValue}
                  error="Budget amount is required"
                  showError={showErrors && !budgetValue}
                  allowCents={true}
                  maxAmount={100000}
                />
              </div>
              <CurrencyInput
                label="Investment Amount"
                value={genericAmountValue}
                onChange={setGenericAmountValue}
                error="Investment amount is required"
                showError={showErrors && !genericAmountValue}
                allowCents={true}
              />
              <Button 
                onClick={() => setShowErrors(true)}
                variant="outline"
                className="w-full"
              >
                Validate Form (Trigger Errors)
              </Button>
              {showErrors && (
                <Button 
                  onClick={() => setShowErrors(false)}
                  variant="ghost"
                  className="w-full"
                >
                  Reset Validation
                </Button>
              )}
            </CardContent>
          </Card>

          {/* Typography Showcase */}
          <Card>
            <CardHeader>
              <CardTitle>Typography</CardTitle>
              <CardDescription>
                Sophisticated font combinations
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-serif text-lg font-semibold text-portola-green mb-1">
                  Adobe Garamond Pro
                </h3>
                <p className="text-sm text-steel font-sans">
                  Primary serif font for labels and headings
                </p>
              </div>
              <div>
                <h3 className="font-script text-xl text-forest-moss mb-1">
                  Dancing Script
                </h3>
                <p className="text-sm text-steel font-sans">
                  Elegant script for color names and accents
                </p>
              </div>
              <div>
                <h3 className="font-sans text-base font-medium text-charcoal mb-1">
                  Inter Sans
                </h3>
                <p className="text-sm text-steel font-sans">
                  Clean sans-serif for body text and descriptions
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Status Colors */}
          <Card>
            <CardHeader>
              <CardTitle>Functional Colors</CardTitle>
              <CardDescription>
                System feedback and status indicators
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 bg-grass rounded-full"></div>
                <span className="font-serif text-sm text-portola-green">Success - Grass</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 bg-alert rounded-full"></div>
                <span className="font-serif text-sm text-portola-green">Error - Alert</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 bg-rock rounded-full"></div>
                <span className="font-serif text-sm text-portola-green">Disabled - Rock</span>
              </div>
              <Button variant="danger" size="sm" className="w-full mt-4">
                Danger Button
              </Button>
            </CardContent>
          </Card>

          {/* Neutral Tones */}
          <Card>
            <CardHeader>
              <CardTitle>Neutral Tones</CardTitle>
              <CardDescription>
                Sophisticated grays and earth tones
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-4 gap-2">
                <div className="space-y-1">
                  <div className="h-8 bg-onyx rounded border border-pebble"></div>
                  <p className="text-xs font-serif text-center">Onyx</p>
                </div>
                <div className="space-y-1">
                  <div className="h-8 bg-charcoal rounded border border-pebble"></div>
                  <p className="text-xs font-serif text-center">Charcoal</p>
                </div>
                <div className="space-y-1">
                  <div className="h-8 bg-pebble rounded border border-steel"></div>
                  <p className="text-xs font-serif text-center">Pebble</p>
                </div>
                <div className="space-y-1">
                  <div className="h-8 bg-cloud rounded border border-pebble"></div>
                  <p className="text-xs font-serif text-center">Cloud</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Component Features */}
          <Card>
            <CardHeader>
              <CardTitle>Design Features</CardTitle>
              <CardDescription>
                Thoughtful details and interactions
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                <p className="text-sm font-sans text-charcoal">✓ Subtle shadows and depth</p>
                <p className="text-sm font-sans text-charcoal">✓ Smooth hover transitions</p>
                <p className="text-sm font-sans text-charcoal">✓ Accessible focus states</p>
                <p className="text-sm font-sans text-charcoal">✓ Natural color harmony</p>
                <p className="text-sm font-sans text-charcoal">✓ Elegant typography scale</p>
              </div>
              <Button variant="accent" size="sm" className="w-full">
                Explore More
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default App
