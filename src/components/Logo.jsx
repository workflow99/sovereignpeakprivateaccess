export default function Logo({ className = "" }) {
  return (
    <div className={`flex items-center ${className}`}>
      <img src="/logo.png" alt="Company Logo" className="h-9 w-auto object-contain" />
    </div>
  );
}
