
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { CalendarIcon, Clock, MapPin, Mail, User } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface ScheduleVisitDialogProps {
  property: {
    id: string;
    title: string;
    location: string;
    builder: string;
  };
  children: React.ReactNode;
}

const ScheduleVisitDialog = ({ property, children }: ScheduleVisitDialogProps) => {
  const [date, setDate] = useState<Date>();
  const [timeSlot, setTimeSlot] = useState<string>("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [open, setOpen] = useState(false);
  const { toast } = useToast();

  const timeSlots = [
    "9:00 AM - 10:00 AM",
    "10:00 AM - 11:00 AM",
    "11:00 AM - 12:00 PM",
    "12:00 PM - 1:00 PM",
    "2:00 PM - 3:00 PM",
    "3:00 PM - 4:00 PM",
    "4:00 PM - 5:00 PM",
    "5:00 PM - 6:00 PM"
  ];

  const handleSchedule = () => {
    if (!date || !timeSlot || !name || !email) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    // Here you would typically send the data to your backend
    // For now, we'll just show a success message
    toast({
      title: "Visit Scheduled Successfully!",
      description: `Your visit for ${property.title} has been scheduled for ${format(date, "PPP")} at ${timeSlot}. Confirmation emails have been sent to you and the builder.`,
    });

    // Reset form
    setDate(undefined);
    setTimeSlot("");
    setName("");
    setEmail("");
    setMessage("");
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CalendarIcon className="h-5 w-5" />
            Schedule a Visit
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Property Info */}
          <div className="bg-accent/20 p-4 rounded-lg">
            <h3 className="font-semibold mb-2">{property.title}</h3>
            <div className="flex items-center text-sm text-muted-foreground mb-1">
              <MapPin className="h-4 w-4 mr-1" />
              {property.location}
            </div>
            <div className="flex items-center text-sm text-muted-foreground">
              <User className="h-4 w-4 mr-1" />
              Builder: {property.builder}
            </div>
          </div>

          {/* Date Selection */}
          <div className="space-y-3">
            <Label>Select Date</Label>
            <div className="border rounded-lg p-3">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                disabled={(date) => date < new Date() || date.getDay() === 0}
                className={cn("p-0 pointer-events-auto")}
              />
            </div>
          </div>

          {/* Time Slot Selection */}
          <div className="space-y-3">
            <Label>Select Time Slot</Label>
            <Select value={timeSlot} onValueChange={setTimeSlot}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a time slot" />
              </SelectTrigger>
              <SelectContent>
                {timeSlots.map((slot) => (
                  <SelectItem key={slot} value={slot}>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-2" />
                      {slot}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Contact Information */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name *</Label>
              <Input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email Address *</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="message">Additional Message (Optional)</Label>
            <Textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Any specific requirements or questions..."
              rows={3}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button 
              onClick={handleSchedule}
              className="flex-1"
              disabled={!date || !timeSlot || !name || !email}
            >
              Schedule Visit
            </Button>
            <Button 
              variant="outline" 
              onClick={() => setOpen(false)}
              className="flex-1"
            >
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ScheduleVisitDialog;
