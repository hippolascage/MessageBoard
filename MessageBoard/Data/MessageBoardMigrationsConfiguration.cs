using System;
using System.Collections.Generic;
using System.Data.Entity.Migrations;
using System.Linq;

namespace MessageBoard.Data
{
    public class MessageBoardMigrationsConfiguration : DbMigrationsConfiguration<MessageBoardContext>
    {
        public MessageBoardMigrationsConfiguration()
        {
#if DEBUG
            this.AutomaticMigrationDataLossAllowed = true;
            this.AutomaticMigrationsEnabled = true;
#endif
        }

        protected override void Seed(MessageBoardContext context)
        {
            base.Seed(context);
#if DEBUG
            if (context.Topics.Count() == 0)
            {
                var topic = new Topic()
                {
                    Title = "This post is about something",
                    Created = DateTime.Now,
                    Body = "Here I am describing my feelings on the matter",
                    Replies = new List<Reply>()
                    {
                        new Reply()
                        {
                            Body = "I concur",
                            Created = DateTime.Now
                        },
                        new Reply()
                        {
                            Body = "I couldn't disagree more strongly",
                            Created = DateTime.Now
                        }
                    }

                };

                context.Topics.Add(topic);

                var anotherTopic = new Topic()
                {
                    Title = "This post is about something else",
                    Created = DateTime.Now,
                    Body = "These words are some words",
               };

                context.Topics.Add(anotherTopic);

                try
                {
                    context.SaveChanges();
                }
                catch (Exception ex)
                {
                    var msg = ex.Message;
                }
            }
#endif
        }
    }
}