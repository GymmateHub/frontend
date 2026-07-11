import { useState, useRef } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { EventInput, DateSelectArg, EventClickArg } from "@fullcalendar/core";
import { Modal } from "../components/ui/modal";
import { useModal } from "../hooks/useModal";
import PageMeta from "../components/common/PageMeta";
import { useAuth } from "../auth/auth.store";
import {
  useClasses,
  useClassSchedules,
  useCreateClassSchedule,
  useUpdateClassSchedule,
  useDeleteClassSchedule,
} from "../features/classes/classes.hooks";
import type { ClassScheduleResponse } from "../features/classes/classes.api";

const statusColor: Record<string, string> = {
  SCHEDULED: "primary",
  IN_PROGRESS: "warning",
  COMPLETED: "success",
  CANCELLED: "danger",
};

const inputClass =
  "dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800";

/** Formats an ISO datetime for a datetime-local input (YYYY-MM-DDTHH:mm). */
const toLocalInput = (iso: string) => (iso ? iso.slice(0, 16) : "");

const Calendar: React.FC = () => {
  const { user } = useAuth();
  const gymId = user?.gymId ?? "";
  const calendarRef = useRef<FullCalendar>(null);
  const { isOpen, openModal, closeModal } = useModal();

  const { data: schedules = [] } = useClassSchedules(gymId);
  const { data: classes = [] } = useClasses(gymId);
  const createSchedule = useCreateClassSchedule();
  const updateSchedule = useUpdateClassSchedule();
  const deleteSchedule = useDeleteClassSchedule();

  const [editing, setEditing] = useState<ClassScheduleResponse | null>(null);
  const [classId, setClassId] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  const classNames = new Map(classes.map((c: { id: string; name: string }) => [c.id, c.name]));

  const events: EventInput[] = schedules.map((s) => ({
    id: s.id,
    title: classNames.get(s.classId) ?? "Class",
    start: s.startTime,
    end: s.endTime,
    extendedProps: { calendar: statusColor[s.status?.toUpperCase()] ?? "primary" },
  }));

  const resetForm = () => {
    setEditing(null);
    setClassId("");
    setStartTime("");
    setEndTime("");
  };

  const handleDateSelect = (selectInfo: DateSelectArg) => {
    resetForm();
    const startOfDay = `${selectInfo.startStr.slice(0, 10)}T09:00`;
    setStartTime(startOfDay);
    setEndTime(`${selectInfo.startStr.slice(0, 10)}T10:00`);
    openModal();
  };

  const handleEventClick = (clickInfo: EventClickArg) => {
    const schedule = schedules.find((s) => s.id === clickInfo.event.id);
    if (!schedule) return;
    setEditing(schedule);
    setClassId(schedule.classId);
    setStartTime(toLocalInput(schedule.startTime));
    setEndTime(toLocalInput(schedule.endTime));
    openModal();
  };

  const handleSave = () => {
    if (!classId || !startTime || !endTime || !gymId) return;
    const payload = { gymId, classId, startTime, endTime };
    const onSuccess = () => {
      closeModal();
      resetForm();
    };
    if (editing) {
      updateSchedule.mutate({ id: editing.id, data: payload }, { onSuccess });
    } else {
      createSchedule.mutate(payload, { onSuccess });
    }
  };

  const handleDelete = () => {
    if (!editing) return;
    deleteSchedule.mutate(editing.id, {
      onSuccess: () => {
        closeModal();
        resetForm();
      },
    });
  };

  const isSaving = createSchedule.isPending || updateSchedule.isPending;

  return (
    <>
      <PageMeta
        title="Class Calendar | GymMateHub"
        description="Manage your gym class schedule."
      />
      <div className="rounded-2xl border  border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
        <div className="custom-calendar">
          <FullCalendar
            ref={calendarRef}
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            headerToolbar={{
              left: "prev,next addEventButton",
              center: "title",
              right: "dayGridMonth,timeGridWeek,timeGridDay",
            }}
            events={events}
            selectable={true}
            select={handleDateSelect}
            eventClick={handleEventClick}
            eventContent={renderEventContent}
            customButtons={{
              addEventButton: {
                text: "Schedule Class +",
                click: () => {
                  resetForm();
                  openModal();
                },
              },
            }}
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
                {editing ? "Edit Class Session" : "Schedule Class Session"}
              </h5>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Sessions appear on the members' mobile app for booking.
              </p>
            </div>
            <div className="mt-8">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                  Class
                </label>
                <select
                  value={classId}
                  onChange={(e) => setClassId(e.target.value)}
                  className={inputClass}
                >
                  <option value="">Select a class…</option>
                  {classes.map((c: { id: string; name: string }) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
                {classes.length === 0 && (
                  <p className="mt-1.5 text-xs text-warning-600 dark:text-warning-400">
                    No classes yet — create one on the Classes page first.
                  </p>
                )}
              </div>

              <div className="mt-6">
                <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                  Starts
                </label>
                <input
                  type="datetime-local"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className={inputClass}
                />
              </div>

              <div className="mt-6">
                <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                  Ends
                </label>
                <input
                  type="datetime-local"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className={inputClass}
                />
              </div>
            </div>
            <div className="flex items-center gap-3 mt-6 modal-footer sm:justify-end">
              {editing && (
                <button
                  onClick={handleDelete}
                  disabled={deleteSchedule.isPending}
                  type="button"
                  className="flex justify-center rounded-lg border border-error-300 px-4 py-2.5 text-sm font-medium text-error-600 hover:bg-error-50 dark:border-error-700 dark:text-error-400 dark:hover:bg-error-500/10 disabled:opacity-50 sm:mr-auto"
                >
                  Delete
                </button>
              )}
              <button
                onClick={closeModal}
                type="button"
                className="flex w-full justify-center rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] sm:w-auto"
              >
                Close
              </button>
              <button
                onClick={handleSave}
                disabled={isSaving || !classId || !startTime || !endTime}
                type="button"
                className="btn btn-success btn-update-event flex w-full justify-center rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-brand-600 disabled:opacity-50 disabled:cursor-not-allowed sm:w-auto"
              >
                {editing ? "Save Changes" : "Schedule"}
              </button>
            </div>
          </div>
        </Modal>
      </div>
    </>
  );
};

const renderEventContent = (eventInfo: {
  timeText: string;
  event: { title: string; extendedProps: { calendar: string } };
}) => {
  const colorClass = `fc-bg-${eventInfo.event.extendedProps.calendar.toLowerCase()}`;
  return (
    <div
      className={`event-fc-color flex fc-event-main ${colorClass} p-1 rounded-sm`}
    >
      <div className="fc-daygrid-event-dot"></div>
      <div className="fc-event-time">{eventInfo.timeText}</div>
      <div className="fc-event-title">{eventInfo.event.title}</div>
    </div>
  );
};

export default Calendar;
