export default function Footer() {
  return (
    <footer>
      <div className="flex h-16 items-center justify-center">
        <div className="flex items-center justify-center">
          <p className="text-sm text-gray-500">
            © {new Date().getFullYear()} International Study Spots
          </p>
        </div>
      </div>
    </footer>
  );
}
