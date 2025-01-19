import { useQuery } from "@tanstack/react-query";

import query from "@/Utils/request/query";
import questionnaireApi from "@/types/questionnaire/questionnaireApi";

interface EditQuestionnaireOption {
  slug: string;
  title: string;
}

const DEFAULT_OPTIONS: EditQuestionnaireOption[] = [
  {
    slug: "encounter",
    title: "Update Encounter",
  },
];

export default function useQuestionnaireOptions(slug: string) {
  const { data } = useQuery({
    queryKey: ["questionnaires", slug] as const,
    queryFn: query(questionnaireApi.list, {
      queryParams: {
        tag_slug: slug,
      },
      silent: (res) => res.status === 404,
    }),
  });

  const questionnaireOptions =
    data?.results?.map((q) => ({
      slug: q.slug,
      title: q.title,
    })) ?? [];

  return [...DEFAULT_OPTIONS, ...questionnaireOptions];
}
