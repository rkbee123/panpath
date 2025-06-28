import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Shield, Play, Users, Droplets, Pill, Heart, Mic, MessageSquare, Activity, ArrowRight, Globe, Zap, Eye, TrendingUp, ChevronRight } from 'lucide-react';
import SignupModal from '../components/SignupModal';
import InteractiveMap from '../components/InteractiveMap';

export default function Home() {
  const [showSignupModal, setShowSignupModal] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    {
      icon: Droplets,
      title: 'Collect Signals',
      description: 'Wastewater, pharmacy, wearables, cough audio, social & syndromic feeds—ingested securely at the edge.',
      detail: 'Our edge computing network processes over 156,000 live signals from 89 countries in real-time.'
    },
    {
      icon: Zap,
      title: 'Edge Detection',
      description: 'Federated anomaly detectors identify unusual patterns in each signal stream.',
      detail: 'AI models trained on historical outbreak data detect anomalies with 94% accuracy.'
    },
    {
      icon: Globe,
      title: 'Cluster & Characterize',
      description: 'Graph neural networks cluster signals into pathogen events with confidence scores.',
      detail: 'Multi-modal fusion algorithms combine diverse data sources for comprehensive analysis.'
    },
    {
      icon: TrendingUp,
      title: 'Spread Simulation',
      description: 'Spatio-temporal diffusion models forecast risk across geographic regions.',
      detail: 'Monte Carlo simulations predict outbreak trajectories with 1-4 week forecasts.'
    },
    {
      icon: Eye,
      title: 'Actionable Alerts',
      description: 'Precise alerts & prescriptive guidance delivered to health authorities.',
      detail: 'Automated response protocols trigger within minutes of detection.'
    }
  ];

  const features = [
    {
      icon: Globe,
      title: 'Data Ingestion',
      description: 'Wastewater, pharmacy, wearables, cough audio, social & syndromic feeds—ingested securely at the edge.',
    },
    {
      icon: Zap,
      title: 'AI Fusion',
      description: 'Federated anomaly detectors & graph neural networks cluster signals into pathogen events.',
    },
    {
      icon: Eye,
      title: 'Predict & Alert',
      description: 'Spatio-temporal diffusion models forecast risk; precise alerts & prescriptive guidance.',
    },
  ];

  const newsItems = [
    {
      title: 'Cough cases spike in Mumbai schools',
      location: 'Mumbai, India',
      time: '2 hours ago',
      severity: 'high'
    },
    {
      title: 'Wastewater signals elevated in São Paulo',
      location: 'São Paulo, Brazil',
      time: '4 hours ago',
      severity: 'medium'
    },
    {
      title: 'Pharmacy sales anomaly detected',
      location: 'Lagos, Nigeria',
      time: '6 hours ago',
      severity: 'low'
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep((prev) => (prev + 1) % steps.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const scrollToLiveFeed = () => {
    document.getElementById('live-feed')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Background Video Effect */}
        <div className="absolute inset-0 data-flow-bg">
          <div className="absolute inset-0 bg-gradient-to-br from-primary-dark/30 via-primary/20 to-primary/30"></div>
          {/* Animated Data Particles */}
          <div className="absolute inset-0">
            {[...Array(20)].map((_, i) => (
              <div
                key={i}
                className="absolute w-1 h-1 bg-primary rounded-full opacity-60"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 20}s`,
                  animation: `dataFlow ${20 + Math.random() * 10}s linear infinite`
                }}
              />
            ))}
          </div>
        </div>

        <div className="relative z-10 max-w-container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="mb-8">
            <Shield className="h-20 w-20 text-primary mx-auto mb-6 animate-pulse-ring" />
          </div>
          
          <h1 className="text-h1 font-bold text-text-primary mb-6 leading-tight">
            Stop the Next Pandemic
            <br />
            <span className="text-primary">Before It Starts</span>
          </h1>
          
          <p className="text-xl text-text-secondary mb-10 max-w-3xl mx-auto leading-relaxed">
            An AI-powered, multi-signal platform that detects outbreaks days before clinical systems.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={scrollToLiveFeed}
              className="btn-primary px-8 py-4 text-button font-semibold text-white rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 uppercase"
            >
              See Live Demo
              <Play className="ml-2 h-5 w-5" />
            </button>
            <button
              onClick={() => setShowSignupModal(true)}
              className="btn-secondary px-8 py-4 text-button font-semibold rounded-lg transition-all duration-200 uppercase"
            >
              Join the Beta
              <Users className="ml-2 h-5 w-5" />
            </button>
          </div>
        </div>
      </section>

      {/* What We Do */}
      <section className="py-24 bg-card">
        <div className="max-w-container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-h2 font-bold text-text-primary mb-4">
              What We Do
            </h2>
            <p className="text-xl text-text-secondary max-w-3xl mx-auto">
              Three core capabilities that make early pandemic detection possible
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index} 
                className="bg-background rounded-lg p-8 shadow-card hover:shadow-card-hover transition-all duration-300 text-center group"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-primary bg-opacity-10 rounded-lg mb-6 group-hover:bg-primary group-hover:text-white transition-all duration-300">
                  <feature.icon className="h-8 w-8 text-primary group-hover:text-white" />
                </div>
                <h3 className="text-h3 font-bold text-text-primary mb-4">
                  {feature.title}
                </h3>
                <p className="text-text-secondary leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How PanPath Works */}
      <section className="py-24 bg-background">
        <div className="max-w-container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-h2 font-bold text-text-primary mb-4">
              How PanPath Works
            </h2>
            <p className="text-xl text-text-secondary max-w-3xl mx-auto">
              Five-step process from signal collection to actionable alerts
            </p>
          </div>

          <div className="grid md:grid-cols-5 gap-6">
            {steps.map((step, index) => (
              <div 
                key={index}
                className={`scroll-card bg-card rounded-lg p-6 cursor-pointer transition-all duration-300 ${
                  currentStep === index ? 'ring-2 ring-primary shadow-card-hover scale-105' : 'hover:shadow-card-hover'
                }`}
                onClick={() => setCurrentStep(index)}
              >
                <div className="text-center">
                  <div className={`inline-flex items-center justify-center w-12 h-12 rounded-lg mb-4 transition-all duration-300 ${
                    currentStep === index ? 'bg-primary text-white' : 'bg-primary bg-opacity-10 text-primary'
                  }`}>
                    <step.icon className="h-6 w-6" />
                  </div>
                  <h3 className="font-semibold text-text-primary mb-2">
                    {step.title}
                  </h3>
                  <p className="text-sm text-text-secondary">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Detail Panel */}
          <div className="mt-8 bg-card rounded-lg p-8 shadow-card">
            <div className="flex items-start space-x-4">
              <div className="bg-primary bg-opacity-10 p-3 rounded-lg">
                {React.createElement(steps[currentStep].icon, { className: "h-6 w-6 text-primary" })}
              </div>
              <div>
                <h3 className="text-xl font-semibold text-text-primary mb-2">
                  {steps[currentStep].title}
                </h3>
                <p className="text-text-secondary">
                  {steps[currentStep].detail}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why We Do It */}
      <section className="py-24 bg-card">
        <div className="max-w-container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-h2 font-bold text-text-primary">
                Why We Do It
              </h2>
              <p className="text-xl text-text-secondary leading-relaxed">
                We're a global student-powered team on a mission to protect humanity—detecting threats before they strike. 
                Join us to build the world's first planetary pathogen radar.
              </p>
              <p className="text-text-secondary leading-relaxed">
                Every pandemic starts with a single case. By the time traditional surveillance systems detect an outbreak, 
                it's often too late for effective containment. Our mission is to change that.
              </p>
              <button
                onClick={() => setShowSignupModal(true)}
                className="btn-primary px-8 py-4 text-button font-semibold text-white rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 uppercase"
              >
                Support Our Mission
                <ArrowRight className="ml-2 h-5 w-5" />
              </button>
            </div>
            <div className="relative">
              <div className="bg-gradient-to-br from-primary to-primary-dark rounded-lg p-8 text-white">
                <div className="grid grid-cols-2 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold mb-2">89</div>
                    <div className="text-sm opacity-90">Countries Protected</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold mb-2">156K</div>
                    <div className="text-sm opacity-90">Live Signals</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold mb-2">2,847</div>
                    <div className="text-sm opacity-90">Active Monitors</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold mb-2">24/7</div>
                    <div className="text-sm opacity-90">Global Coverage</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Live Feed & News */}
      <section id="live-feed" className="py-24 bg-background">
        <div className="max-w-container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-h2 font-bold text-text-primary mb-4">
              Live Feed & Intelligence
            </h2>
            <p className="text-xl text-text-secondary max-w-3xl mx-auto">
              Real-time outbreak detection and automated news generation
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Map */}
            <div className="lg:col-span-2">
              <div className="bg-card rounded-lg p-6 shadow-card">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-semibold text-text-primary">Global Threat Map</h3>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
                    <span className="text-sm text-text-secondary">Live</span>
                  </div>
                </div>
                <InteractiveMap />
              </div>
            </div>

            {/* News Carousel */}
            <div className="space-y-6">
              <div className="bg-card rounded-lg p-6 shadow-card">
                <h3 className="text-xl font-semibold text-text-primary mb-6">Live Intelligence</h3>
                <div className="space-y-4">
                  {newsItems.map((item, index) => (
                    <div key={index} className="border-l-4 border-primary pl-4 py-2">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-medium text-text-primary text-sm">{item.title}</h4>
                          <p className="text-xs text-text-secondary mt-1">{item.location}</p>
                        </div>
                        <div className={`w-2 h-2 rounded-full mt-2 ${
                          item.severity === 'high' ? 'bg-error' :
                          item.severity === 'medium' ? 'bg-warning' : 'bg-success'
                        }`}></div>
                      </div>
                      <p className="text-xs text-text-secondary mt-2">{item.time}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Signal Types Filter */}
              <div className="bg-card rounded-lg p-6 shadow-card">
                <h3 className="text-lg font-semibold text-text-primary mb-4">Signal Sources</h3>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { icon: Droplets, name: 'Wastewater', active: true },
                    { icon: Pill, name: 'Pharmacy', active: true },
                    { icon: Heart, name: 'Wearables', active: false },
                    { icon: Mic, name: 'Acoustic', active: true },
                    { icon: MessageSquare, name: 'Social', active: false },
                    { icon: Activity, name: 'Syndromic', active: true },
                  ].map((signal, index) => (
                    <div key={index} className={`flex items-center space-x-2 p-2 rounded-lg transition-colors ${
                      signal.active ? 'bg-primary bg-opacity-10 text-primary' : 'bg-background text-text-secondary'
                    }`}>
                      <signal.icon className="h-4 w-4" />
                      <span className="text-sm font-medium">{signal.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-text-primary text-white">
        <div className="max-w-container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-h2 font-bold mb-6">
            Ready to Join the Fight?
          </h2>
          <p className="text-xl opacity-90 mb-10 max-w-2xl mx-auto">
            Be part of the global early warning network. Every signal matters in preventing the next pandemic.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => setShowSignupModal(true)}
              className="bg-primary hover:bg-white hover:text-primary px-8 py-4 text-button font-semibold rounded-lg transition-all duration-200 uppercase"
            >
              Join the Beta
              <Users className="ml-2 h-5 w-5" />
            </button>
            <Link
              to="/dashboard"
              className="border-2 border-white hover:bg-white hover:text-text-primary px-8 py-4 text-button font-semibold rounded-lg transition-all duration-200 uppercase inline-flex items-center justify-center"
            >
              View Dashboard
              <ChevronRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Signup Modal */}
      <SignupModal 
        isOpen={showSignupModal}
        onClose={() => setShowSignupModal(false)}
      />
    </div>
  );
}