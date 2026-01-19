import AddNoteToCurrent from './AddNoteToCurrent';

function Header() {
  return (
    <header>
      <AddNoteToCurrent />
      <div className="header-logo">
        <img src="/logo300.png" className="header-icon" /> <h2>Snotify</h2>
      </div>
    </header>
  );
}

export default Header;
