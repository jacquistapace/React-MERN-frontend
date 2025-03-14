import { useEffect, useMemo, useState } from "react";
import Modal from "react-modal";
import DatePicker, { registerLocale } from "react-datepicker";

import es from "date-fns/locale/es";

registerLocale("es", es);

import "react-datepicker/dist/react-datepicker.css";

import { addHours, differenceInSeconds } from "date-fns";
import Swal from "sweetalert2";


import { useCalendarStore, useUiStore } from "../../hooks";

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
  },
};

Modal.setAppElement("#root");

export const CalendarModal = () => {
  const { isDateModalOpen, closeDateModal } = useUiStore();
  const [formSubmitted, setFormSubmitted] = useState(false);
  const { activeEvent, startSavingEvent } = useCalendarStore();

  const [formValues, setFormValues] = useState({
    title: "",
    notes: "",
    start: new Date(),
    end: addHours(new Date(), 2),
  });

  const titleClass = useMemo(() => {
    if (!formSubmitted) {
      return "";
    }

    return formValues.title.length > 0 ? "" : "is-invalid";
  }, [formValues.title, formSubmitted]);

  useEffect(() => {
    if (activeEvent) {
      setFormValues({ ...activeEvent });
    }
  }, [activeEvent]);

  const onInputChange = ({ target }) => {
    setFormValues({
      ...formValues,
      [target.name]: target.value,
    });
  };

  const onCloseModal = () => {
    closeDateModal();
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    setFormSubmitted(true);
    
    const difference = differenceInSeconds(formValues.end, formValues.start);

    if (isNaN(difference) || difference <= 0) {
      alert("Fechas incorrectas");
      return;
    }

    if (formValues.title.length <= 0) {
      Swal.fire("Ingrese un título", "El título es obligatorio", "error");
      return;
    }

    console.log(formValues);
    //TODO
    await startSavingEvent(formValues);
    closeDateModal();
    setFormSubmitted(false);
  };

  return (
    <Modal
      closeTimeoutMS={200}
      className="modal"
      overlayClassName="modal-fondo"
      isOpen={isDateModalOpen}
      style={customStyles}
      onRequestClose={onCloseModal}
    >
      <h1> Nuevo evento </h1>
      <hr />
      <form className="container" onSubmit={onSubmit}>
        <div className="form-group mb-2 d-flex flex-column">
          <label>Fecha y hora inicio</label>
          <DatePicker
            name="start"
            onChange={(date) =>
              onInputChange({ target: { name: "start", value: date } })
            }
            className="form-control"
            selected={formValues.start}
            dateFormat="Pp"
            showTimeSelect
            locale="es"
            timeCaption="Hora"
          />
        </div>
        <div className="form-group mb-2 d-flex flex-column">
          <label>Fecha y hora fin</label>
          <DatePicker
            minDate={formValues.start}
            name="end"
            onChange={(date) =>
              onInputChange({ target: { name: "end", value: date } })
            }
            className="form-control"
            selected={formValues.end}
            dateFormat="Pp"
            showTimeSelect
            locale="es"
            timeCaption="Hora"
          />
        </div>
        <hr />
        <div className="form-group mb-2">
          <label>Titulo y notas</label>
          <input
            type="text"
            className={`form-control ${titleClass}`}
            placeholder="Título del evento"
            name="title"
            autoComplete="off"
            value={formValues.title}
            onChange={onInputChange}
          />
          <small id="emailHelp" className="form-text text-muted">
            Una descripción corta
          </small>
        </div>

        <div className="form-group mb-2">
          <textarea
            type="text"
            className="form-control"
            placeholder="Notas"
            rows="5"
            name="notes"
            value={formValues.notes}
            onChange={onInputChange}
          ></textarea>
          <small id="emailHelp" className="form-text text-muted">
            Información adicional
          </small>
        </div>

        <button type="submit" className="btn btn-outline-primary btn-block">
          <i className="far fa-save"></i>
          <span> Guardar</span>
        </button>
      </form>
    </Modal>
  );
};
