import initialContent from "@/data/content.json";
import initialMessages from "@/data/messages.json";
import initialAnalytics from "@/data/analytics.json";
import { jsonRequest, supabaseRequest } from "@/models/supabase";
import type { Message, Project, Resume, Skill } from "@/models/types";

type Content = { projects: Project[]; skills: Skill[] };
type StateRow<T> = { id: string; payload: T };

async function getState<T>(id: string, initial: T): Promise<T> {
  let rows = await supabaseRequest<StateRow<T>[]>(`/rest/v1/portfolio_state?id=eq.${id}&select=payload`);
  if (!rows[0]) {
    await supabaseRequest("/rest/v1/portfolio_state?on_conflict=id", jsonRequest(
      [{ id, payload: initial }], "resolution=ignore-duplicates,return=minimal",
    ));
    rows = await supabaseRequest<StateRow<T>[]>(`/rest/v1/portfolio_state?id=eq.${id}&select=payload`);
  }
  if (!rows[0]) throw new Error(`Could not load ${id} data from Supabase.`);
  return rows[0].payload;
}

export async function getContent(): Promise<Content> {
  return getState<Content>("content", { projects: initialContent.projects as Project[], skills: initialContent.skills as Skill[] });
}

export async function saveContent(content: Content): Promise<void> {
  await supabaseRequest("/rest/v1/portfolio_state?on_conflict=id", jsonRequest(
    [{ id: "content", payload: content }], "resolution=merge-duplicates,return=minimal",
  ));
}

export async function getResume(): Promise<Resume> {
  return getState<Resume>("resume", { url: "/original-resume.pdf", filename: "resume.pdf", updatedAt: null });
}

export async function saveResume(resume: Resume): Promise<void> {
  await supabaseRequest("/rest/v1/portfolio_state?on_conflict=id", jsonRequest(
    [{ id: "resume", payload: resume }], "resolution=merge-duplicates,return=minimal",
  ));
}

export async function getMessages(): Promise<Message[]> {
  if (initialMessages.length) {
    await supabaseRequest("/rest/v1/portfolio_messages?on_conflict=id", jsonRequest(
      initialMessages.map(message => ({ id: message.id, created_at: message.createdAt, payload: message })),
      "resolution=ignore-duplicates,return=minimal",
    ));
  }
  const rows = await supabaseRequest<{ payload: Message }[]>(
    "/rest/v1/portfolio_messages?select=payload&order=created_at.desc&limit=500",
  );
  return rows.map(row => row.payload);
}

export async function addMessage(message: Message): Promise<void> {
  await supabaseRequest("/rest/v1/portfolio_messages", jsonRequest({
    id: message.id, created_at: message.createdAt, payload: message,
  }, "return=minimal"));
}

export async function getVisits(): Promise<number> {
  const analytics = await getState("analytics", initialAnalytics);
  return analytics.visits;
}

export async function addVisit(): Promise<void> {
  await getState("analytics", initialAnalytics);
  await supabaseRequest("/rest/v1/rpc/portfolio_increment_visit", jsonRequest({}));
}
