import { Button, Card, CardBody, CardFooter, Typography } from "@material-tailwind/react";
import PropTypes from 'prop-types';

const CardComponent = ({ card, onExplore, isComingSoon }) => {
  return (
    <Card className="bg-white dark:bg-slate-700 text-gray-900 dark:text-white overflow-hidden transform transition duration-500 ease-in-out hover:scale-105 relative">
      {isComingSoon && (
        <div className="absolute inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <Typography variant="h5" className="text-white">
            Coming Soon...
          </Typography>
        </div>
      )}
      <img
        src={card.imgSrc}
        alt={card.title}
        className="w-full h-auto bg-slate-500"
      />
      <CardBody>
        <Typography variant="h2" className="font-bold mb-2 text-blue-gray-900 dark:text-blue-gray-50">
          {card.title}
        </Typography>
        <div className="font-normal bg-green-50 dark:bg-slate-500 p-4 rounded-lg mt-5">
          <ul>
            {card.items.map((item, itemIndex) => (
              <li key={itemIndex} className="text-gray-900 dark:text-gray-50">
                {item}
              </li>
            ))}
          </ul>
        </div>
      </CardBody>
      <CardFooter className="pt-0">
        <Button onClick={() => onExplore(card.title, card.link)} size="sm" variant="text" className="flex items-center gap-2 text-gray-900 dark:text-white relative group">
          Explore
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="h-4 w-4 transition-transform duration-200 ease-in-out transform group-hover:translate-x-1"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3"
            />
          </svg>
        </Button>
      </CardFooter>
    </Card>
  );
};

CardComponent.propTypes = {
  card: PropTypes.shape({
    imgSrc: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    items: PropTypes.arrayOf(PropTypes.string).isRequired,
    link: PropTypes.string,
  }).isRequired,
  onExplore: PropTypes.func.isRequired,
  isComingSoon: PropTypes.bool,
};

export default CardComponent;
