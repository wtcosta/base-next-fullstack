"use client";
import type React from "react";
import { useState, useRef, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import type {
  EventInput,
  DateSelectArg,
  EventClickArg,
  EventContentArg,
} from "@fullcalendar/core";
import { useModal } from "@/hooks/useModal";
import { Modal } from "@/components/ui/modal";
import { useUserPermissions } from "@/hooks/useUserPermissions";

interface CalendarProps {
  events: {
    id: string;
    title: string;
    date: string; // ou Date
    description?: string | null;
    status: string; // Provavelmente um dos: 'CONFIRMADO', 'PENDENTE', 'EM_ANALISE', 'CANCELADO'
    location: string;
  }[];
}

interface CalendarEvent extends EventInput {
  extendedProps: {
    status: string;
    description?: string | null;
    location: string;
  };
}

const Calendar: React.FC<CalendarProps> = ({ events: initialEvents }) => {
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [eventTitle, setEventTitle] = useState("");
  const [eventStartDate, setEventStartDate] = useState("");
  const [eventEndDate, setEventEndDate] = useState("");
  const [eventStatus, setEventStatus] = useState("");
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const calendarRef = useRef<FullCalendar>(null);
  const { isOpen, openModal, closeModal } = useModal();
  const { hasAnyRole } = useUserPermissions();
  const isAdmin = hasAnyRole(['ADMINISTRADOR', 'SUPERADMIN']);

  const statusColors = {
    CONFIRMADO: "success",
    PENDENTE: "warning",
    EM_ANALISE: "primary",
    CANCELADO: "danger",
  };

  useEffect(() => {
    const formattedEvents: CalendarEvent[] = initialEvents.map(event => {
      const eventDate = new Date(event.date);
      return {
        id: event.id,
        title: event.title,
        start: eventDate.toISOString().split('T')[0], // Formata para YYYY-MM-DD
        end: eventDate.toISOString().split('T')[0], // Formata para YYYY-MM-DD
        allDay: true,
        description: event.description,
        extendedProps: {
          status: event.status,
          description: event.description,
          location: event.location
        }
      };
    });
    setEvents(formattedEvents);
  }, [initialEvents]);

  const handleDateSelect = (selectInfo: DateSelectArg) => {
    if (!isAdmin) return; // Apenas admin pode criar eventos
    resetModalFields();
    setEventStartDate(selectInfo.startStr);
    setEventEndDate(selectInfo.endStr || selectInfo.startStr);
    openModal();
  };

  const handleEventClick = (clickInfo: EventClickArg) => {
    const event = clickInfo.event;
    setSelectedEvent(event as unknown as CalendarEvent);
    setEventTitle(event.title);
    setEventStartDate(event.start?.toISOString().split("T")[0] || "");
    setEventEndDate(event.end?.toISOString().split("T")[0] || "");
    setEventStatus(event.extendedProps.status);
    openModal();
  };

  const handleAddOrUpdateEvent = () => {
    if (!isAdmin) return; // Apenas admin pode editar eventos
    
    if (selectedEvent) {
      // Update existing event
      setEvents((prevEvents) =>
        prevEvents.map((event) =>
          event.id === selectedEvent.id
            ? {
                ...event,
                title: eventTitle,
                start: eventStartDate,
                end: eventEndDate,
                extendedProps: { 
                  ...event.extendedProps,
                  status: eventStatus 
                },
              }
            : event
        )
      );
    } else {
      // Add new event
      const newEvent: CalendarEvent = {
        id: Date.now().toString(),
        title: eventTitle,
        start: eventStartDate,
        end: eventEndDate,
        allDay: true,
        extendedProps: {
          status: eventStatus || 'PENDENTE',
          location: ''
        },
      };
      setEvents((prevEvents) => [...prevEvents, newEvent]);
    }
    closeModal();
    resetModalFields();
  };

  const resetModalFields = () => {
    setEventTitle("");
    setEventStartDate("");
    setEventEndDate("");
    setEventStatus("");
    setSelectedEvent(null);
  };

  return (
    <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
      <div className="custom-calendar">
        <FullCalendar
          ref={calendarRef}
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          locale="pt-br"
          events={events}
          selectable={isAdmin}
          editable={isAdmin}
          headerToolbar={{
            left: isAdmin ? "prev,next today addEventButton" : "prev,next today",
            center: "title",
            right: "dayGridMonth,timeGridWeek,timeGridDay",
          }}
          buttonText={{
            today: "Hoje",
            month: "Mês",
            week: "Semana",
            day: "Dia",
          }}
          customButtons={{
            addEventButton: {
              text: "+ Evento",
              click: () => {
                openModal();
                setEventTitle("");
                setEventStartDate("");
                setEventEndDate("");
                setEventStatus("");
                setSelectedEvent(null);
              },
            },
          }}
          select={handleDateSelect}
          eventClick={handleEventClick}
          eventContent={renderEventContent}
          eventTimeFormat={{
            hour: "2-digit",
            minute: "2-digit",
            meridiem: false,
            hour12: false
          }}
          dayMaxEvents={true}
          firstDay={0}
          weekends={true}
          displayEventTime={false}
          eventDisplay="block"
        />
      </div>
      <Modal
        isOpen={isOpen}
        onClose={closeModal}
        className="max-w-[700px] p-6 lg:p-10"
      >
        <div className="flex flex-col px-2 overflow-y-auto custom-scrollbar">
          <div>
            <h5 className="mb-2 font-semibold text-gray-800 modal-title text-theme-xl dark:text-white/90 lg:text-2xl">
              {selectedEvent ? (isAdmin ? "Editar Evento" : "Detalhes do Evento") : "Adicionar Evento"}
            </h5>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {selectedEvent?.extendedProps.description || "Detalhes do evento"}
            </p>
          </div>
          <div className="mt-8">
            <div>
              <div>
                <label htmlFor="event-title" className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                  Título do Evento
                </label>
                <input
                  id="event-title"
                  type="text"
                  value={eventTitle}
                  onChange={(e) => setEventTitle(e.target.value)}
                  disabled={!isAdmin}
                  className="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-none focus:ring focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
                />
              </div>
            </div>
            {isAdmin && (
              <div className="mt-6">
                <label
                  htmlFor="event-status"
                  className="block mb-4 text-sm font-medium text-gray-700 dark:text-gray-400"
                >
                  Status do Evento
                </label>
                <div className="flex flex-wrap items-center gap-4 sm:gap-5">
                  {Object.entries(statusColors).map(([status, color]) => (
                    <div key={status} className="n-chk">
                      <div className={`form-check form-check-${color} form-check-inline`}>
                        <label
                          className="flex items-center text-sm text-gray-700 form-check-label dark:text-gray-400"
                          htmlFor={`modal${status}`}
                        >
                          <span className="relative">
                            <input
                              className="sr-only form-check-input"
                              type="radio"
                              name="event-status"
                              value={status}
                              id={`modal${status}`}
                              checked={eventStatus === status}
                              onChange={() => setEventStatus(status)}
                            />
                            <span className="flex items-center justify-center w-5 h-5 mr-2 border border-gray-300 rounded-full box dark:border-gray-700">
                              <span className="w-2 h-2 bg-white rounded-full dark:bg-transparent" />
                            </span>
                          </span>
                          {status}
                        </label>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-6">
              <label
                htmlFor="event-start-date"
                className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400"
              >
                Data de Início
              </label>
              <div className="relative">
                <input
                  id="event-start-date"
                  type="date"
                  value={eventStartDate}
                  onChange={(e) => setEventStartDate(e.target.value)}
                  disabled={!isAdmin}
                  className="dark:bg-dark-900 h-11 w-full appearance-none rounded-lg border border-gray-300 bg-transparent bg-none px-4 py-2.5 pl-4 pr-11 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-none focus:ring focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
                />
              </div>
            </div>

            <div className="mt-6">
              <label
                htmlFor="event-end-date"
                className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400"
              >
                Data de Término
              </label>
              <div className="relative">
                <input
                  id="event-end-date"
                  type="date"
                  value={eventEndDate}
                  onChange={(e) => setEventEndDate(e.target.value)}
                  disabled={!isAdmin}
                  className="dark:bg-dark-900 h-11 w-full appearance-none rounded-lg border border-gray-300 bg-transparent bg-none px-4 py-2.5 pl-4 pr-11 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-none focus:ring focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
                />
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3 mt-6 modal-footer sm:justify-end">
            <button
              onClick={closeModal}
              type="button"
              className="flex w-full justify-center rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] sm:w-auto"
            >
              Fechar
            </button>
            {isAdmin && (
              <button
                onClick={handleAddOrUpdateEvent}
                type="button"
                className="btn btn-success btn-update-event flex w-full justify-center rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-brand-600 sm:w-auto"
              >
                {selectedEvent ? "Atualizar Evento" : "Adicionar Evento"}
              </button>
            )}
          </div>
        </div>
      </Modal>
    </div>
  );
};

const renderEventContent = (eventInfo: EventContentArg) => {
  const status = eventInfo.event.extendedProps.status.toLowerCase();
  const colorClass = `fc-bg-${status === 'confirmado' ? 'success' : 
                            status === 'pendente' ? 'warning' :
                            status === 'em_analise' ? 'primary' : 'danger'}`;
  
  return (
    <div className={`event-fc-color flex fc-event-main ${colorClass} p-1 rounded`}>
      <div className="fc-daygrid-event-dot" />
      <div className="fc-event-time">{eventInfo.timeText}</div>
      <div className="fc-event-title">{eventInfo.event.title}</div>
    </div>
  );
};

export default Calendar;
