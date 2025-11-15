const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-gray-200 mt-auto">
      <div className="container mx-auto px-4 py-4">
        <div className="text-center text-sm text-gray-500 space-y-1">
          <p>
            Criado por{' '}
            <span className="text-gray-600">Rute Cintra</span>,{' '}
            <span className="text-gray-600">Letycia Araújo</span>,{' '}
            <span className="text-gray-600">Edylla Camilla</span>,{' '}
            <span className="text-gray-600">Bruna Oliveira</span> e{' '}
            <span className="text-gray-600">Diego Oliver</span>
          </p>
          <p className="text-xs text-gray-400">
            © 2025. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

