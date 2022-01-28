package ca.bc.gov.tno.dal.db.entities;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.Id;
import javax.persistence.IdClass;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import ca.bc.gov.tno.dal.db.AuditColumns;

/**
 * ContentLink class, provides a way to manage content links.
 */
@Entity
@IdClass(ContentLinkPK.class)
@Table(name = "content_link", schema = "public")
public class ContentLink extends AuditColumns {
  /**
   * Primary key to identify the content link.
   * Foreign key to content.
   */
  @Id
  @Column(name = "content_id", nullable = false)
  private int contentId;

  /**
   * The content reference.
   */
  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "content_id", insertable = false, updatable = false)
  private Content content;

  /**
   * Primary key to identify the content link.
   * Foreign key to content link .
   */
  @Id
  @Column(name = "link_id", nullable = false)
  private int linkId;

  /**
   * The content link reference.
   */
  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "link_id", insertable = false, updatable = false)
  private Content link;

  /**
   * Creates a new instance of a ContentLink object.
   */
  public ContentLink() {

  }

  /**
   * Creates a new instance of a ContentLink object, initializes with
   * specified
   * parameters.
   * 
   * @param content Content object
   * @param link    Link object
   */
  public ContentLink(Content content, Content link) {
    if (content == null)
      throw new NullPointerException("Parameter 'content' cannot be null.");
    if (link == null)
      throw new NullPointerException("Parameter 'link' cannot be null.");

    this.content = content;
    this.contentId = content.getId();
    this.link = link;
    this.linkId = link.getId();
  }

  /**
   * @return int return the contentId
   */
  public int getContentId() {
    return contentId;
  }

  /**
   * @param contentId the contentId to set
   */
  public void setContentId(int contentId) {
    this.contentId = contentId;
  }

  /**
   * @return Content return the content
   */
  public Content getContent() {
    return content;
  }

  /**
   * @param content the content to set
   */
  public void setContent(Content content) {
    this.content = content;
  }

  /**
   * @return int return the linkId
   */
  public int getLinkId() {
    return linkId;
  }

  /**
   * @param linkId the linkId to set
   */
  public void setLinkId(int linkId) {
    this.linkId = linkId;
  }

  /**
   * @return Content return the link
   */
  public Content getLink() {
    return link;
  }

  /**
   * @param link the link to set
   */
  public void setLink(Content link) {
    this.link = link;
  }

}
