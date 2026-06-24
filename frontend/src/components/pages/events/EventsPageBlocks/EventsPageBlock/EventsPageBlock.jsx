import React from "react";
import { Link } from "react-router-dom";
import { useLocale } from "../../../../../context/LocaleContext.jsx";
import { getLangField } from "../../../../../utils/getLangField.js";
import { formatLocalizedDate } from "../../../../../utils/dateLocale.js";
import { useTranslation } from "../../../../../utils/useTranslation.js";

export default function EventsPageBlock({ event }) {
  const { locale } = useLocale();
  const { t } = useTranslation();
  const name = getLangField(event, "name", locale);
  const desc = getLangField(event, "desc", locale);
  const place = getLangField(event, "place", locale);

  const imgUrl =
    event.desc_img?.formats?.small?.url ||
    event.desc_img?.formats?.medium?.url ||
    event.desc_img?.url;

  const category = getLangField(event?.categories?.[0], "name", locale);

  return (
    <Link to={`/${locale}/events/${event.slug}`} className="eventspage__item">
      <div className="img__wrapper">
        <img src={imgUrl} alt="back_img" />
      </div>
      <div className="eventspage__content">
        <p className="eventspage__item-cat">{category}</p>
        <h3 className="eventspage__item-title">{name}</h3>
        <p className="eventspage__item-text">{desc}</p>
        <div className="eventspage__item-footer">
          <div className="date">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
              <path d="M85.1,18.5H77v-4.5c0-1.9-1.6-3.5-3.5-3.5h-5c-1.9,0-3.5,1.6-3.5,3.5v4.5H35.3v-4.5c0-1.9-1.6-3.5-3.5-3.5h-5  c-1.9,0-3.5,1.6-3.5,3.5v4.5h-8.5c-3.4,0-6.2,2.8-6.2,6.2v55.9c0,3.4,2.8,6.2,6.2,6.2h70.3c3.4,0,6.2-2.8,6.2-6.2V24.7  C91.3,21.3,88.5,18.5,85.1,18.5z M68.7,14.3h4.6v6.1v4.9h-4.6v-4.9V14.3z M27,14.3h4.6v6.1v4.9H27v-4.9V14.3z M14.9,22.2h8.5v3.3  c0,1.9,1.6,3.5,3.5,3.5h5c1.9,0,3.5-1.6,3.5-3.5v-3.3H65v3.3c0,1.9,1.6,3.5,3.5,3.5h5c1.9,0,3.5-1.6,3.5-3.5v-3.3h8.2  c1.4,0,2.5,1.1,2.5,2.5v10H12.4v-10C12.4,23.3,13.5,22.2,14.9,22.2z M85.1,83.1H14.9c-1.4,0-2.5-1.1-2.5-2.5V38.4h75.2v42.2  C87.6,82,86.5,83.1,85.1,83.1z" />
            </svg>
            <p>
              {formatLocalizedDate(event.start, locale)}
              {event.end ? ` — ${formatLocalizedDate(event.end, locale)}` : ""}
            </p>
          </div>
          <div className="place">
            <svg
              fill="#000000"
              viewBox="0 0 32 32"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g data-name="Layer 12" id="Layer_12">
                <path d="M16,17a5,5,0,1,0-5-5A5,5,0,0,0,16,17Zm0-8a3,3,0,1,1-3,3A3,3,0,0,1,16,9Z" />
                <path d="M22.72,20.57C24.89,16.78,26,13.89,26,12A10,10,0,0,0,6,12c0,1.89,1.11,4.78,3.28,8.57C6.33,21.09,2,22.32,2,25c0,3.44,7.26,5,14,5s14-1.56,14-5C30,22.32,25.67,21.09,22.72,20.57ZM16,4a8,8,0,0,1,8,8c0,1.68-1.33,4.81-3.74,8.82-.18.3-.36.6-.55.9,0,.08-.09.15-.13.22l-.45.71a1.74,1.74,0,0,1-.11.18c-.37.58-.74,1.15-1.09,1.67l-.08.12-.45.67-.07.1c-.33.49-.64.94-.91,1.32l-.06.08-.32.46,0,.05,0-.05c-.49-.68-1.14-1.61-1.87-2.7h0c-.35-.54-.73-1.11-1.11-1.71l-.12-.19L12.44,22l-.17-.27-.42-.7-.11-.18h0C9.33,16.81,8,13.68,8,12A8,8,0,0,1,16,4ZM4,25c0-.59,1.88-1.91,6.36-2.59l0,.05.42.67.07.12.46.73,0,0c.32.51.65,1,1,1.48l0,0,.43.64.08.11.35.52.07.1.34.5.05.06L14,28C7.75,27.65,4,26,4,25ZM18,28l.34-.48.05-.08.34-.49.07-.1.34-.5.1-.14.35-.53.1-.15c.31-.46.62-.94.94-1.45l.11-.16.37-.59.16-.26.32-.52.06-.09c4.48.68,6.36,2,6.36,2.59C28,26,24.25,27.65,18,28Z" />
              </g>
            </svg>
            <p>{place}</p>
          </div>
          <div className="amount">
            <svg
              fill="#000000"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M.221 16.268a15.064 15.064 0 0 0 1.789 1.9C2.008 18.111 2 18.057 2 18a5.029 5.029 0 0 1 3.233-4.678 1 1 0 0 0 .175-1.784A2.968 2.968 0 0 1 4 9a2.988 2.988 0 0 1 5.022-2.2 5.951 5.951 0 0 1 2.022-.715 4.994 4.994 0 1 0-7.913 6.085 7.07 7.07 0 0 0-2.91 4.098z" />
              <path d="M18.954 20.284a7.051 7.051 0 0 0-3.085-5.114A4.956 4.956 0 0 0 17 12a5 5 0 1 0-8.869 3.17 7.051 7.051 0 0 0-3.085 5.114 14.923 14.923 0 0 0 1.968.849C7.012 21.088 7 21.046 7 21a5.031 5.031 0 0 1 3.233-4.678 1 1 0 0 0 .175-1.785A2.964 2.964 0 0 1 9 12a3 3 0 1 1 6 0 2.964 2.964 0 0 1-1.408 2.537 1 1 0 0 0 .175 1.785A5.031 5.031 0 0 1 17 21c0 .046-.012.088-.013.133a14.919 14.919 0 0 0 1.967-.849z" />
            </svg>
            <p>
              {event.amount != null ? event.amount.toLocaleString() : "—"}{" "}
              {t("participants")}{" "}
            </p>
          </div>
        </div>
        <div className="eventspage__item-more">
          <button className="eventspage__item-button">Подробнее</button>
          {event.price > 0 ? (
            <p className="price">{event.price} тг.</p>
          ) : (
            <p className="price">Бесплатно</p>
          )}
        </div>
      </div>
    </Link>
  );
}
