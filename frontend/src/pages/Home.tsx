import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const Home: React.FC = () => {
  return (
    <div className="min-h-screen bg-berlim-dark text-white font-sans overflow-x-hidden">
      <Navbar />

      {/* Hero Section */}
      <section id="inicio" className="relative h-screen flex items-center justify-center pt-20">
        <div 
          className="absolute inset-0 z-0 bg-cover bg-center"
          style={{ backgroundImage: 'url("https://berlimobras.com.br/wp-content/uploads/2025/05/474587200_18481103407042264_381915885287226745_n.jpg")' }}
        >
          {/* Overlay to darken background image */}
          <div className="absolute inset-0 bg-black bg-opacity-60"></div>
        </div>
        
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto flex flex-col items-center">
          <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6 text-white drop-shadow-lg">
            Soluções em engenharia para seu <span className="text-berlim-orange">projeto</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-200 mb-10 max-w-2xl drop-shadow-md">
            Transforme sua obra com a Berlim Obras: serviços completos e especializados para cada etapa do seu projeto.
          </p>
          <a 
            href="https://wa.me/5585996249352?text=Olá,%20vim%20do%20site.%20Quero%20mais%20informações%20sobre%20os%20serviços!" 
            target="_blank" 
            rel="noreferrer"
            className="bg-berlim-orange hover:bg-orange-600 text-white font-bold py-4 px-10 rounded-md uppercase tracking-widest transition-transform hover:scale-105 shadow-xl"
          >
            Entre em Contato
          </a>
        </div>
      </section>

      {/* Services Section */}
      <section id="servicos" className="py-20 px-6 md:px-12 bg-white text-gray-900">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row gap-12 items-start mb-16">
            <div className="md:w-1/3">
              <h3 className="text-berlim-orange font-bold uppercase tracking-wider mb-2">Nossos serviços</h3>
              <h2 className="text-3xl md:text-4xl font-bold text-berlim-dark">Soluções em construção e reformas</h2>
              <p className="mt-4 text-gray-600">Serviços completos com qualidade, segurança e agilidade para construir ou renovar seu projeto.</p>
              <a 
                href="https://wa.me/5585996249352" 
                target="_blank" 
                rel="noreferrer"
                className="mt-6 inline-block border-2 border-berlim-orange text-berlim-orange hover:bg-berlim-orange hover:text-white font-bold py-3 px-8 rounded-md transition-colors"
              >
                Solicitar Orçamento
              </a>
            </div>
            
            <div className="md:w-2/3 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { title: 'Reformas', img: 'https://berlimobras.com.br/wp-content/uploads/2025/05/REFORMA-2.png' },
                { title: 'Alvenaria', img: 'https://berlimobras.com.br/wp-content/uploads/2025/05/CASA-2.png' },
                { title: 'Hidráulica', img: 'https://berlimobras.com.br/wp-content/uploads/2025/05/hidraulica-1.png' },
                { title: 'Elétrica', img: 'https://berlimobras.com.br/wp-content/uploads/2025/05/Eletrica-1.png' },
                { title: 'Pinturas', img: 'https://berlimobras.com.br/wp-content/uploads/2025/05/pintura-1.png' },
                { title: 'Gesso', img: 'https://berlimobras.com.br/wp-content/uploads/2025/05/reforma-1.png' }
              ].map((service, idx) => (
                <div key={idx} className="bg-gray-50 border border-gray-200 rounded-lg p-6 flex flex-col items-center justify-center text-center hover:shadow-lg transition-shadow group">
                  <div className="h-20 w-20 flex items-center justify-center mb-4 overflow-hidden">
                    <img src={service.img} alt={service.title} className="w-16 object-contain group-hover:scale-110 transition-transform" />
                  </div>
                  <h4 className="text-xl font-bold text-berlim-dark">{service.title}</h4>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* About Us Section */}
      <section id="sobrenos" className="py-20 px-6 md:px-12 bg-berlim-light text-gray-900">
        <div className="max-w-6xl mx-auto flex flex-col items-center">
          <h3 className="text-berlim-orange font-bold uppercase tracking-wider mb-2">Nossas apresentações</h3>
          <h2 className="text-3xl md:text-4xl font-bold text-berlim-dark text-center max-w-2xl mb-16">
            Soluções pioneiras em construção desde 2013
          </h2>

          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="md:w-1/2 relative">
              <img 
                src="https://berlimobras.com.br/wp-content/uploads/2025/05/About-Us-Image-3.jpg" 
                alt="Sobre Nós" 
                className="rounded-lg shadow-xl w-full"
              />
              <img 
                src="https://berlimobras.com.br/wp-content/uploads/2025/05/Graphic-1.png" 
                alt="Graphic" 
                className="absolute -bottom-10 -left-10 w-32 hidden md:block"
              />
            </div>
            
            <div className="md:w-1/2 flex flex-col justify-center">
              <p className="text-gray-700 text-lg mb-8 leading-relaxed">
                Na Berlim, unimos experiência, técnica e inovação para transformar projetos em obras de excelência. Atuamos com foco em qualidade, cumprimento de prazos e satisfação total do cliente.
              </p>
              
              <ul className="space-y-4 mb-8">
                {['Especialização e Experiência', 'Gestão Eficiente de Projetos', 'Serviços abrangentes', 'Garantia de qualidade'].map((item, idx) => (
                  <li key={idx} className="flex items-center gap-3 text-gray-800 font-medium">
                    <svg className="w-5 h-5 text-berlim-orange" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    {item}
                  </li>
                ))}
              </ul>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h5 className="font-bold text-berlim-dark text-lg mb-1">Proficiência Técnica</h5>
                  <div className="w-12 h-1 bg-berlim-orange"></div>
                </div>
                <div>
                  <h5 className="font-bold text-berlim-dark text-lg mb-1">Gerenciamento de projetos</h5>
                  <div className="w-12 h-1 bg-berlim-orange"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-24 px-6 md:px-12 flex items-center justify-center bg-berlim-dark text-center">
        <div 
          className="absolute inset-0 z-0 bg-cover bg-center"
          style={{ backgroundImage: 'url("https://berlimobras.com.br/wp-content/uploads/2025/05/CTA-BG.jpg")' }}
        >
          <div className="absolute inset-0 bg-berlim-orange bg-opacity-80"></div>
        </div>
        
        <div className="relative z-10 max-w-3xl mx-auto flex flex-col items-center">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-8">
            Pronto para começar a construir? Agende sua consulta agora!
          </h2>
          <a 
            href="https://wa.me/5585996249352" 
            target="_blank" 
            rel="noreferrer"
            className="bg-white text-berlim-orange hover:bg-gray-100 font-bold py-4 px-10 rounded-md uppercase tracking-widest transition-transform hover:scale-105 shadow-xl"
          >
            Falar com Especialista
          </a>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;
