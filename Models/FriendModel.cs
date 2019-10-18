using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Rikku.Models
{
    public class FriendModel
    {          
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }
        public string UserId { get; set; }
        public string FriendId { get; set; }
    }
}