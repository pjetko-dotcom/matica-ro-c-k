export enum ActivityType {
  LECTURE = 'prednáška',
  PROGRAM = 'program',
  FOOD = 'jedlo',
  OTHER = 'ostatné'
}

export interface ScoutEvent {
  id: string;
  startTime: string; // HH:mm format
  endTime: string;   // HH:mm format
  title: string;
  category: ActivityType;
  responsible?: string;
  shadow?: string;
}

export interface DaySchedule {
  id: string;
  date: string;
  events: ScoutEvent[];
  isCollapsed?: boolean;
}

export enum PostponeType {
  SINGLE = 'SINGLE',
  CASCADE = 'CASCADE'
}