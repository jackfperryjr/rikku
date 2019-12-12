using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Rikku.Models
{
    public class BlogModel
    {          
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int BlogId { get; set; }
        public string UserId { get; set; }
        [MaxLength(255)]
        public string Content { get; set; }
        public string PictureId { get; set; }
        public int IsLiked { get; set; }
        public int IsLoved { get; set; }
        public int IsDisliked { get; set; }
        public int IsSaddened { get; set; }
        public int IsLaughed { get; set; }
    }
}