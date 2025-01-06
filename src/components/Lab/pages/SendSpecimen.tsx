import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

import { Specimen } from "@/types/emr/specimen";

import { SendSpecimenForm } from "../SendSpecimenForm";

export default function SendSpecimen() {
  const [specimen, setSpecimen] = useState<Specimen[]>([]);

  return (
    <div className="mx-auto max-w-5xl flex flex-col gap-5">
      <Button
        variant="outline"
        onClick={() => {
          history.back();
        }}
        className="w-fit"
      >
        Back
      </Button>
      <h2 className="text-2xl leading-tight">Send Collected Specimen to Lab</h2>
      <div className="flex flex-col bg-white shadow-sm rounded-sm p-4 gap-5">
        <SendSpecimenForm
          onSuccess={(createdSpecimen) =>
            setSpecimen([createdSpecimen, ...specimen])
          }
        />
      </div>
      <div>
        <Label className="text-xl font-medium text-gray-900">
          Ready for Dispatch
        </Label>

        <div className="flex flex-col gap-4 mt-6"></div>
      </div>
    </div>
  );
}

// {specimens.map((specimen) => (
//     <Collapsible>
//       <div className="relative before:content-[''] before:absolute before:top-0 before:left-0 before:h-7 before:w-1 before:bg-gray-400 before:mt-3.5 before:rounded-r-sm">
//         <div
//           className={`items-center px-4 py-3 border rounded-lg shadow-sm max-w-5xl mx-auto space-y-4`}
//         >
//           <div className="flex items-center gap-4 justify-between">
//             <div>
//               <span className="text-sm font-medium text-gray-600">
//                 Specimen id
//               </span>
//               <div className="flex items-center gap-2">
//                 <span className="text-lg font-semibold text-gray-900">
//                   {specimen.identifier ?? specimen.id.slice(0, 8)}
//                 </span>
//                 <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-900 rounded">
//                   Ready for Dispatch
//                 </span>
//               </div>
//             </div>
//             <div className="flex items-center">
//               <div className="flex items-center gap-4">
//                 <CollapsibleTrigger asChild>
//                   <Button variant="ghost" size="sm">
//                     <div className="">
//                       {/* {openOrders[order.orderId] ? (
//                       <ChevronUpIcon className="h-6 w-8" />
//                     ) : ( */}
//                       <ChevronDownIcon className="h-6 w-8" />
//                       {/* )} */}
//                     </div>
//                   </Button>
//                 </CollapsibleTrigger>
//               </div>
//             </div>
//           </div>

//           {/* Expanded Content */}
//           <CollapsibleContent>
//             <div className="space-y-4">
//               <div className="max-w-5xl bg-white shadow rounded-lg p-6">
//                 <div className="flex flex-col md:flex-row gap-4">
//                   {/* Left Section */}
//                   <div className="w-full md:w-1/2 pl-2">
//                     <h3 className="text-sm font-semibold text-gray-600">
//                       Test
//                     </h3>
//                     <p className="font-semibold">
//                       {specimen.request.code.display ??
//                         specimen.request.code.code}
//                     </p>
//                   </div>

//                   {/* Right Section */}
//                   <div className="w-full md:w-1/2 md:border-l border-gray-300 sm:pl-4 sm:pb-4">
//                     <h3 className="text-sm font-semibold text-gray-600">
//                       Order Placed by
//                     </h3>
//                     <div className="flex gap-2">
//                       <p className="text-lg font-semibold text-gray-900 mb-4">
//                         {specimen.request.requester?.first_name}{" "}
//                         {specimen.request.requester?.last_name}
//                       </p>
//                       <p className="text-lg font-normal text-gray-900 mb-4">
//                         ({specimen.request.requester?.user_type})
//                       </p>
//                     </div>

//                     <h3 className="text-sm font-semibold text-gray-600">
//                       Order Date/Time
//                     </h3>
//                     <p className="text-lg font-semibold text-gray-900 mb-4">
//                       {specimen.request.authored_on}
//                     </p>

//                     <h3 className="text-sm font-semibold text-gray-600">
//                       Priority
//                     </h3>
//                     <span className="px-3 py-1 inline-block text-sm font-semibold text-red-600 bg-red-100 rounded-lg">
//                       {specimen.request.priority ?? "Routine"}
//                     </span>
//                   </div>
//                 </div>
//                 {/* Note Section */}
//                 <div className="border-t border-gray-300 px-2 py-4 max-w-4xl">
//                   <h3 className="text-sm font-semibold text-gray-600">
//                     Note:
//                   </h3>
//                   <p className="text-gray-700">
//                     {specimen.request.note
//                       .map((note) => note.text)
//                       .join("\n") || "No note provided"}
//                   </p>
//                 </div>
//               </div>
//             </div>
//           </CollapsibleContent>
//         </div>
//       </div>
//     </Collapsible>
//   ))}
