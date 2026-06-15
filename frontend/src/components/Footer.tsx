import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-berlim-dark text-white py-12 px-6">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
        <div>
          <img src="/logo.png" alt="Berlim Engenharia Logo" className="h-16 object-contain mb-4" />
          <p className="text-gray-400 font-sans text-sm max-w-sm">
            Soluções completas em engenharia, reformas e infraestrutura. Experiência, técnica e inovação para transformar seu projeto.
          </p>
        </div>
        
        <div className="flex flex-col items-center md:items-end">
          <p className="text-berlim-orange font-sans font-bold text-lg mb-2">Fale Conosco</p>
          <a 
            href="https://wa.me/5585996249352" 
            target="_blank" 
            rel="noreferrer"
            className="text-gray-300 hover:text-white transition-colors"
          >
            (85) 99624-9352
          </a>
        </div>
      </div>
      
      <div className="max-w-6xl mx-auto mt-8 pt-8 border-t border-gray-700 text-center text-gray-500 text-sm font-sans">
        &copy; {new Date().getFullYear()} Berlim Obras e Engenharia. Todos os direitos reservados.
      </div>
    </footer>
  );
};

export default Footer;
