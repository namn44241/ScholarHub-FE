import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { isObjectNull } from "@/utils/functions";
import { Pencil } from "lucide-react";
import { useState } from "react";
import { useGetPersonal } from "../hooks/use-personal";
import { formatDate, toCapitalize } from "../utils/functions";
import type { IPersonalInfoSectionProps } from "../utils/types";
import { PersonalInfoForm } from "./personal-infos-form";

const PersonalInfoSection = ({ isCurrentUser }: IPersonalInfoSectionProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const { data, refetch } = useGetPersonal();

  const handleCancel = () => {
    setIsEditing(false);
  };

  const handleSuccess = () => {
    setIsEditing(false);
    refetch(); // Refresh the data after successful submission
  };

  return (
    <Card className="border-muted-foreground/20">
      <CardHeader className="flex flex-row justify-between items-center pb-4 border-b">
        <div>
          <CardTitle className="text-xl">About</CardTitle>
          <CardDescription>Personal information</CardDescription>
        </div>
        {isCurrentUser && !isEditing && (
          <Button onClick={() => setIsEditing(true)} size="sm">
            <Pencil className="size-4" />
          </Button>
        )}
      </CardHeader>
      <CardContent className="space-y-6">
        {isEditing ? (
          <PersonalInfoForm
            initialData={data}
            onCancel={handleCancel}
            onSuccess={handleSuccess}
          />
        ) : data?.first_name ? (
          <div className="space-y-6">
            <div className="gap-6 grid grid-cols-1 md:grid-cols-2">
              {!isObjectNull(data) && (
                <div>
                  <p className="font-medium text-muted-foreground text-sm">
                    Full Name
                  </p>
                  <p className="mt-1 text-sm break-words">
                    {data.first_name}
                    {data.middle_name ? ` ${data.middle_name} ` : " "}
                    {data.last_name}
                  </p>
                </div>
              )}
              {data.job_title && (
                <div>
                  <p className="font-medium text-muted-foreground text-sm">
                    Job Title
                  </p>
                  <p className="mt-1 break-words">{data.job_title}</p>
                </div>
              )}
              {data.contact_email && (
                <div>
                  <p className="font-medium text-muted-foreground text-sm">
                    Email
                  </p>
                  <p className="mt-1 overflow-hidden break-words text-ellipsis">
                    {data.contact_email}
                  </p>
                </div>
              )}
              {data.nationality && (
                <div>
                  <p className="font-medium text-muted-foreground text-sm">
                    Nationality
                  </p>
                  <p className="mt-1 break-words">{data.nationality}</p>
                </div>
              )}
              {data.country_of_residence && (
                <div>
                  <p className="font-medium text-muted-foreground text-sm">
                    Country of Residence
                  </p>
                  <p className="mt-1 break-words">
                    {data.country_of_residence}
                  </p>
                </div>
              )}
              {data.date_of_birth && (
                <div>
                  <p className="font-medium text-muted-foreground text-sm">
                    Date of Birth
                  </p>
                  <p className="mt-1 break-words">
                    {formatDate(data.date_of_birth)}
                  </p>
                </div>
              )}
              {data.gender && (
                <div>
                  <p className="font-medium text-muted-foreground text-sm">
                    Gender
                  </p>
                  <p className="mt-1 break-words">
                    {toCapitalize(
                      data.gender === "prefer_not_to_say"
                        ? "Prefer not to say"
                        : data.gender === "male"
                        ? "Male"
                        : data.gender === "female"
                        ? "Female"
                        : ""
                    )}
                  </p>
                </div>
              )}
            </div>

            {data.self_introduction && (
              <div>
                <p className="font-medium text-muted-foreground text-sm">
                  Self Introduction
                </p>
                <p className="mt-1 text-justify break-words whitespace-pre-line">
                  {data.self_introduction}
                </p>
              </div>
            )}
          </div>
        ) : (
          <div className="py-6 text-center">
            <p className="text-muted-foreground">
              No personal information added yet.
            </p>
            <Button
              size="sm"
              variant="outline"
              className="mt-2"
              onClick={() => setIsEditing(true)}
            >
              Add Personal Information
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PersonalInfoSection;
