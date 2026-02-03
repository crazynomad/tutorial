#!/usr/bin/env python3
"""
PDF to Images Converter
Convert PDF files to a series of images using ImageMagick.
"""

import argparse
import subprocess
import sys
import os
from pathlib import Path


def check_imagemagick():
    """Check if ImageMagick is available and return the command to use."""
    # Try magick first (ImageMagick v7)
    try:
        result = subprocess.run(['magick', '--version'], capture_output=True, text=True)
        if result.returncode == 0:
            return 'magick'
    except FileNotFoundError:
        pass

    # Try convert (ImageMagick v6 or v7 legacy)
    try:
        result = subprocess.run(['convert', '--version'], capture_output=True, text=True)
        if result.returncode == 0:
            return 'convert'
    except FileNotFoundError:
        pass

    return None


def convert_pdf_to_images(pdf_path, output_dir, dpi=150, format='png', quality=85, prefix='slide'):
    """
    Convert PDF to images using ImageMagick.

    Args:
        pdf_path: Path to the PDF file
        output_dir: Directory for output images
        dpi: Resolution in DPI (default: 150)
        format: Output format (png, jpg, tiff)
        quality: JPEG quality 1-100 (only for jpg)
        prefix: Output filename prefix

    Returns:
        List of generated image paths
    """
    pdf_path = Path(pdf_path).resolve()
    output_dir = Path(output_dir).resolve()

    # Validate PDF exists
    if not pdf_path.exists():
        print(f"Error: PDF file not found: {pdf_path}")
        sys.exit(1)

    if not pdf_path.suffix.lower() == '.pdf':
        print(f"Error: File is not a PDF: {pdf_path}")
        sys.exit(1)

    # Check ImageMagick
    im_cmd = check_imagemagick()
    if not im_cmd:
        print("Error: ImageMagick not found. Please install it:")
        print("  macOS:    brew install imagemagick")
        print("  Ubuntu:   sudo apt-get install imagemagick")
        print("  Windows:  https://imagemagick.org/script/download.php")
        sys.exit(1)

    # Create output directory
    output_dir.mkdir(parents=True, exist_ok=True)

    # Build output pattern
    output_pattern = output_dir / f"{prefix}-%02d.{format}"

    # Build ImageMagick command
    cmd = [im_cmd, '-density', str(dpi)]

    # Add quality for JPEG
    if format.lower() in ['jpg', 'jpeg']:
        cmd.extend(['-quality', str(quality)])

    cmd.extend([str(pdf_path), str(output_pattern)])

    print(f"Converting: {pdf_path.name}")
    print(f"Output directory: {output_dir}")
    print(f"Settings: {dpi} DPI, {format.upper()} format")
    print()

    # Execute conversion
    try:
        result = subprocess.run(cmd, capture_output=True, text=True)
        if result.returncode != 0:
            print(f"Error during conversion:")
            print(result.stderr)
            sys.exit(1)
    except Exception as e:
        print(f"Error executing ImageMagick: {e}")
        sys.exit(1)

    # Find generated files
    generated_files = sorted(output_dir.glob(f"{prefix}-*.{format}"))

    if not generated_files:
        print("Error: No images were generated. Check if PDF is valid.")
        sys.exit(1)

    # Report results
    print(f"Successfully generated {len(generated_files)} images:")
    print()
    for f in generated_files:
        size_kb = f.stat().st_size / 1024
        if size_kb >= 1024:
            size_str = f"{size_kb/1024:.1f} MB"
        else:
            size_str = f"{size_kb:.0f} KB"
        print(f"  {f.name} ({size_str})")

    print()
    print(f"Total: {len(generated_files)} images in {output_dir}")

    return [str(f) for f in generated_files]


def main():
    parser = argparse.ArgumentParser(
        description='Convert PDF to images using ImageMagick',
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  %(prog)s document.pdf                     # Convert to PNG in document-slides/
  %(prog)s document.pdf -o ./images         # Specify output directory
  %(prog)s document.pdf -d 300              # High resolution (300 DPI)
  %(prog)s document.pdf -f jpg -q 90        # Output as JPEG with 90%% quality
  %(prog)s document.pdf -p page             # Use 'page' prefix (page-00.png, ...)
        """
    )

    parser.add_argument('pdf_file', help='Path to the PDF file')
    parser.add_argument('-o', '--output', help='Output directory (default: {pdf_name}-slides/)')
    parser.add_argument('-d', '--dpi', type=int, default=150, help='Resolution in DPI (default: 150)')
    parser.add_argument('-f', '--format', choices=['png', 'jpg', 'jpeg', 'tiff'], default='png',
                        help='Output format (default: png)')
    parser.add_argument('-q', '--quality', type=int, default=85,
                        help='JPEG quality 1-100 (default: 85)')
    parser.add_argument('-p', '--prefix', default='slide',
                        help='Output filename prefix (default: slide)')

    args = parser.parse_args()

    # Determine output directory
    pdf_path = Path(args.pdf_file)
    if args.output:
        output_dir = Path(args.output)
    else:
        # Default: same directory as PDF, with -slides suffix
        output_dir = pdf_path.parent / f"{pdf_path.stem}-slides"

    # Normalize format
    fmt = args.format.lower()
    if fmt == 'jpeg':
        fmt = 'jpg'

    # Convert
    convert_pdf_to_images(
        pdf_path=args.pdf_file,
        output_dir=output_dir,
        dpi=args.dpi,
        format=fmt,
        quality=args.quality,
        prefix=args.prefix
    )


if __name__ == '__main__':
    main()
