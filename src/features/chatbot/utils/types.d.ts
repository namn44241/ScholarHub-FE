export interface IThread {
  user_id: string;
  thread_id: string;
  message_count: number;
  first_message: Date;
  last_message: Date;
  latest_question: string;
  latest_answer: string;
}

export interface IMessage {
  user_id: string;
  thread_id: string;
  question: string;
  answer: string;
  metadata: any;
  created_at: string
}
