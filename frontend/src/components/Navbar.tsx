import React from 'react';

const Navbar: React.FC = () => {
  return (
    <nav className="absolute top-0 left-0 w-full z-50 py-4 px-6 md:px-12 flex items-center justify-between">
      <div className="flex items-center">
        {/* Placeholder for the logo user uploaded. User should put logo in public/logo.png */}
        <img src="/logo.png" alt="Berlim Engenharia Logo" className="h-16 md:h-20 object-contain" />
      </div>
      
      <div className="hidden md:flex gap-8 items-center">
        <a href="#inicio" className="text-white hover:text-berlim-orange font-sans font-medium transition-colors">Início</a>
        <a href="#servicos" className="text-white hover:text-berlim-orange font-sans font-medium transition-colors">Serviços</a>
        <a href="#sobrenos" className="text-white hover:text-berlim-orange font-sans font-medium transition-colors">Sobre Nós</a>
      </div>

      <div className="hidden md:block">
        <a 
          href="https://wa.me/5585996249352?text=Olá,%20vim%20do%20site.%20Quero%20mais%20informações%20sobre%20os%20serviços!" 
          target="_blank" 
          rel="noreferrer"
          className="bg-berlim-orange hover:bg-orange-600 text-white font-sans font-bold py-3 px-6 rounded-md uppercase tracking-wider text-sm transition-colors shadow-lg"
        >
          Entre em Contato
        </a>
      </div>
    </nav>
  );
};

export default Navbar;
