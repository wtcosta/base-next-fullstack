import { useSidebar } from "@/context/SidebarContext";
const Backdrop: React.FC = () => {
  const { isMobileOpen, toggleMobileSidebar } = useSidebar();

  if (!isMobileOpen) return null;

  return (
    <div
      className="fixed inset-0 z-40 bg-gray-900 bg-opacity-50 lg:hidden"
      onClick={toggleMobileSidebar}
      onKeyDown={(e) => e.key === 'Escape' && toggleMobileSidebar()}
      role="button"
      tabIndex={0}
    />
  );
};

export default Backdrop;
