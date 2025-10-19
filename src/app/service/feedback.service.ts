import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { environment } from "../../environments/environment";
import { Injectable } from "@angular/core";
import { FeedbackDataResponse } from "../model/feedback.model";
import { Observable } from "rxjs/internal/Observable";
import { from } from "rxjs/internal/observable/from";
import { take } from "rxjs/internal/operators/take";
import { map } from "rxjs/internal/operators/map";


@Injectable({
    providedIn: 'root'
})
export class FeedbackService {
    private supabase: SupabaseClient;

    constructor() {
        this.supabase = createClient(
            environment.supabase.url,
            environment.supabase.anonKey
        );
    }

    processFeedback(
        feedbackData: {
            content: string;
            email: string;
            category?: string;
        }): Observable<{ success: boolean; data?: any; error?: any }> {
        return from(
            (async () => {
                try {
                    // Insert feedback into the database
                    const { data, error } = await this.supabase
                        .from('feedback')
                        .insert({
                            content: feedbackData.content,
                            email: feedbackData.email,
                            category: feedbackData.category,
                        })
                        .select();

                    if (error) throw error;

                    const feedbackId = data[0].id;

                    // Send notification email
                    const emailBody = {
                        to: feedbackData.email,
                        subject: feedbackData.category,
                        html: this.generateFeedbackEmailTemplate(feedbackData)
                    };

                    await this.supabase.functions
                        .invoke('email_notification', {
                            body: JSON.stringify(emailBody)
                        });

                    // Update email sent status
                    await this.supabase
                        .from('feedback')
                        .update({ email_sent: true })
                        .eq('id', feedbackId);

                    return { success: true, data: data[0] };
                } catch (error) {
                    console.error('Error processing feedback:', error);
                    return { success: false, error };
                }
            })()
        ).pipe(take(1));
    }

    private generateFeedbackEmailTemplate(
        feedbackData: { content: string; email: string; category?: string }): string {
        return `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background: #4CAF50; color: white; padding: 20px; text-align: center; }
                .content { padding: 20px; background: #f9f9f9; }
                .footer { padding: 10px; text-align: center; font-size: 12px; color: #666; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h2>Thank You for Your Feedback!</h2>
                </div>
                <div class="content">
                    <p>Dear User,</p>
                    <p>Thank you for taking the time to share your feedback with us. We have received your message and will review it carefully.</p>
                    
                    <h3>Your Feedback Details:</h3>
                    <p><strong>Category:</strong> ${feedbackData.category || 'General'}</p>
                    <p><strong>Message:</strong></p>
                    <p style="background: white; padding: 15px; border-left: 4px solid #4CAF50;">${feedbackData.content}</p>
                    
                    <p>We appreciate your input and will get back to you if needed.</p>
                    <p>Best regards,<br>The Taqwa Tracker Team</p>
                </div>
                <div class="footer">
                    <p>This is an automated message. Please do not reply to this email.</p>
                </div>
            </div>
        </body>
        </html>
        `;
    }


}