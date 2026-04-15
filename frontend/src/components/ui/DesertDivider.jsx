export default function DesertDivider({ className = '' }) {
  return (
    <div className={`relative h-1 my-6 ${className}`}>
      <div className="absolute inset-0 flex items-center">
        <div className="w-full border-t-2 border-camel-dust border-dashed"></div>
      </div>
      <div className="relative flex justify-center">
        <span className="bg-camel-paper px-4 text-camel-tobacco text-2xl">
          🌵
        </span>
      </div>
    </div>
  )
}
