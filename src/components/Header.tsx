export function Header() {
  return (
    <header className="bg-gradient-to-r from-orange-500 to-red-600 text-white py-6 sm:py-8 px-4 shadow-lg">
      <div className="max-w-7xl mx-auto relative">
        <div className="flex items-center justify-center mb-4">
          <div className="text-center">
            <h1 className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold leading-tight">
              Lista de Candidatos do Curso de Bombeiros Militar
            </h1>
          </div>
          <img 
            src="/logo-piaui.svg" 
            alt="Logo do Estado do Piauí" 
            className="h-8 sm:h-10 lg:h-12 w-auto flex-shrink-0 absolute right-0 top-1/2 transform -translate-y-1/2"
          />
        </div>
      </div>
    </header>
  );
}