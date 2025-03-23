"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { userInputSchema, type UserInputType } from "@/lib/defs";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";

type WordFormProps = {
  onSubmit: (data: FormData) => Promise<
    | { success: boolean; error?: undefined }
    | {
        success: boolean;
        error: string;
      }
  >;
};

export default function WordForm({ onSubmit }: WordFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<UserInputType>({
    resolver: zodResolver(userInputSchema),
    defaultValues: {
      word: "Assalomu alaykum    o'qishlaringiz  yaxshimi?",
    },
  });

  const handleSubmit = async (data: UserInputType) => {
    setIsSubmitting(true);
    try {
      // Create FormData to pass to the server action
      const formData = new FormData();
      formData.append("word", data.word);

      await onSubmit(formData);
      toast.success("Word submitted successfully!");
      form.reset();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Something went wrong",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>So&#39;z kiriting</CardTitle>
        <CardDescription>
          Bir nechta so&#39;z kiritishingiz mumkin.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="word"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Textarea
                      placeholder="Enter your words..."
                      {...field}
                      disabled={isSubmitting}
                      autoComplete="off"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full sm:w-auto"
            >
              {isSubmitting ? "Submitting..." : "Submit"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
