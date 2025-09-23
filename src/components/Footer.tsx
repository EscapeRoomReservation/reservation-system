const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-200 mt-auto">
      <div className="container mx-auto text-center py-6">
        <p className="text-gray-500">&copy; {new Date().getFullYear()} EscapeRoom Pro. Wszelkie prawa zastrzeżone.</p>
      </div>
    </footer>
  );
};

export default Footer;
