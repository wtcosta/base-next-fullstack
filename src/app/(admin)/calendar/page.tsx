import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import Calendar from "@/components/calendar/Calendar";

export default async function CalendarPage() {
  const events = [
    {
      id: 'cm7v1d7rf000un4tg635kvrht',
      title: 'Circuito Vida',
      description: 'curso circuito vida',
      date: '2025-03-12T22:00:00.000Z',
      location: 'Colegio Jim Wilson',
      status: 'PENDENTE',
      createdAt: '2025-03-04T22:03:54.123Z',
      updatedAt: '2025-03-04T22:03:54.123Z',
      createdBy: 'cm7uylqew0000n4tp5fi2p7t9'
    },
    {
      id: 'cm7v1b1we000on4tglo0p867g',
      title: 'Seminario Lidere',
      description: 'seminario para todos os lideres',
      date: '2025-03-09T01:00:00.000Z',
      location: 'Sede',
      status: 'PENDENTE',
      createdAt: '2025-03-04T22:02:13.215Z',
      updatedAt: '2025-03-16T14:44:35.404Z',
      createdBy: 'cm7uylqew0000n4tp5fi2p7t9'
    },
    {
      id: 'cm7v18mc7000hn4tg985xi8te',
      title: 'Velos',
      description: 'Envio Missionario',
      date: '2025-03-04T20:00:00.000Z',
      location: 'Sede',
      status: 'CONFIRMADO',
      createdAt: '2025-03-04T22:00:19.728Z',
      updatedAt: '2025-03-14T15:24:19.960Z',
      createdBy: 'cm7uylqew0000n4tp5fi2p7t9'
    }
  ]

  return (
    <div>
      <PageBreadcrumb pageTitle="Calendário" />
      <div className="container mx-auto p-4">
        <Calendar events={events} />
      </div>
    </div>
  );
}
