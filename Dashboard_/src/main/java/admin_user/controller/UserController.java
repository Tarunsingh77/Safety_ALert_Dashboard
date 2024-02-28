package admin_user.controller;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.security.Principal;
import java.util.HashMap;
import java.util.Map;

import jakarta.annotation.Resource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;

import admin_user.dto.UserDto;
import admin_user.service.UserService;

@Controller
public class UserController {
	
	@Autowired
	UserDetailsService userDetailsService;
	
	@Autowired
	private UserService userService;


	@GetMapping("/registration")
	public String getRegistrationPage(@ModelAttribute("user") UserDto userDto) {
		return "register";
	}

	@PostMapping("/registration")
	public String saveUser(@ModelAttribute("user") UserDto userDto, Model model) {
		userService.save(userDto);
		model.addAttribute("message", "Registered Successfuly!");
		return "register";
	}
	
	@GetMapping("/login")
	public String login() {
		return "login";
	}
	
	@GetMapping("user-page")
	public String userPage (Model model, Principal principal) {
		UserDetails userDetails = userDetailsService.loadUserByUsername(principal.getName());
		model.addAttribute("user", userDetails);
		return "user";
	}
//	@GetMapping(value = "/getImage", produces = MediaType.IMAGE_PNG_VALUE)
//	public ResponseEntity<ByteArrayResource> image() throws IOException {
//		ByteArrayResource inputStream = new ByteArrayResource(Files.readAllBytes(Paths.get("/home/tarun/chart.png")));
//		return ResponseEntity
//				.status(HttpStatus.OK)
//				.contentLength(inputStream.contentLength())
//				.body(inputStream);
//	}
	
	@GetMapping("admin-page")
	public String adminPage (Model model, Principal principal) {
		UserDetails userDetails = userDetailsService.loadUserByUsername(principal.getName());
		model.addAttribute("user", userDetails);
		return "index";
	}
	@GetMapping("/parameter")
	public String parameter() {
		return "parameter";
	}

	@GetMapping("/emailAlert")
	public String emailAlert() {
		return "emailAlert";
	}
	@GetMapping("/index")
	public String index() {
		return "index";
	}

	@GetMapping("/error")
	public String error() {
		return "error";
	}
	@GetMapping("/practice")
	public String practice() {
		return "practice";
	}

}
