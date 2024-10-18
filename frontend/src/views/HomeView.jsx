import { useMediaQuery } from 'react-responsive';
import MobileView from '../views/MobileView';
import StartGame from '../views/StartGame';

const HomePage = () => {
  const isMobile = useMediaQuery({ query: '(max-width: 767px)' });

  return (
    <>
      {isMobile ? <MobileView /> : <StartGame />}
    </>
  );
};

export default HomePage;
