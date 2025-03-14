import { useDispatch, useSelector } from "react-redux";

import { onAddNewEvent, onDeleteEvent, onSetActiveEvent, onUpdateEvent } from "../store";

export const useCalendarStore = () => {
  const dispatch = useDispatch();
  const { events, activeEvent } = useSelector((state) => state.calendar);

  const setActiveEvent = (calendarEvent) => {
    dispatch(onSetActiveEvent(calendarEvent));
  }

  const startSavingEvent = async( calendarEvent ) => {
    //TODO: llamada al backend

    if (calendarEvent._id) {
      //Actualizar
      dispatch(onUpdateEvent({...calendarEvent}));
    } else {
      //Crear
      dispatch(onAddNewEvent({ ...calendarEvent, _id: new Date().getTime() }));
    }
  }

  const startDeletingEvent = () => {
    dispatch(onDeleteEvent());
  }

  return {
    //Propiedades
    activeEvent,
    hasEventSelected: !!activeEvent,
    events,
    //Metodos
    setActiveEvent,
    startSavingEvent,
    startDeletingEvent
  };
};
