import PropTypes from "prop-types";

const ModelCard = ({ imageUrl, text }) => {
    return (
        <div className="max-w-full rounded overflow-hidden">
            <img 
                className="w-44 h-auto object-cover shadow-lg" 
                src={imageUrl} 
                alt="Card" 
            />
            <div className="text-center">
                <div className="font-medium text-xs mb-2 break-words">{text}</div>
            </div>
        </div>
    );
};

ModelCard.propTypes = {
    imageUrl: PropTypes.string.isRequired,
    text: PropTypes.string.isRequired
};

export default ModelCard;
