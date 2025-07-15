import { FOOTER_ITEMS } from "../../../utils/constants";
import "./Page-Footer.scss";

const PageFooter = () => {
  return (
    <footer className="footer-container">
        {FOOTER_ITEMS.map((item, index) => (
            <div key={index} className="image-container">
                <img src={item.imageUrl} alt={item.title} />
            </div>
        ))}
    </footer>
  );
}

export default PageFooter;