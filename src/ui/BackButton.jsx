import { IoMdArrowBack } from 'react-icons/io';
import { useNavigate } from 'react-router-dom';

function BackButton({ steps = 1 }) {
  const navigate = useNavigate();
  return (
    <button class="clear-button back-button" onClick={() => navigate(-steps)}>
      <IoMdArrowBack />
    </button>
  );
}

export default BackButton;
